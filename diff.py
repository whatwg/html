#!/usr/bin/env python3
# Copyright (C) 2023 Martin Fischer, released under MIT license
"""
The source of the HTML standard resides in a single file (named `source`)
because Domenic Denicola finds a single file much easier to edit.
This does however mean that you cannot just use `git diff` to see all the changes
to a page of the multipage HTML version (https://html.spec.whatwg.org/multipage/).
This script provides a workaround to:

Run `git diff` against a specific section of the `source` file.

usage: ./diff.py <commit1> [commit2] <section>       Run git diff
       ./diff.py <commit1> toc                       List all sections

So for example you can do:

    ./diff.py 25c78e4b worklets

to see all changes to the Worklets section since its introduction
in 25c78e4b71d9afaa6ff9d731afa53fbd9f345318.
"""

import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass

HELP_SECTIONS = __doc__.split('\n\n')[1:]
USAGE = HELP_SECTIONS[1]

ADDITIONAL_SECTIONS = (
    # Sections listed here will be enabled despite not being a page in the multipage HTML version.
    'Tokenization',
    'Tree construction'
)

def main():
    # We're not using argparse because we want to provide a custom error message
    # when the required section argument isn't given and argparse has a bug that
    # makes this difficult (https://github.com/python/cpython/issues/103498).
    args = sys.argv[1:]

    if len(args) == 0:
        sys.exit('\n\n'.join(HELP_SECTIONS))
    elif len(args) == 1:
        sys.exit(USAGE)
    elif len(args) == 2 and args[1] == 'toc':
        for section in parse_sections(get_source(args[0])):
            print((int(section.level)-2)*'    ' + f'{section.id} ({section.title})')
    elif len(args) == 2:
        diff(args[0], 'HEAD', args[1])
    elif len(args) == 3:
        diff(*args)
    else:
        sys.exit(USAGE)

def diff(commit1: str, commit2: str, section_id: str):
    source1 = get_source(commit1)
    source2 = get_source(commit2)
    section1 = extract_section(source1, section_id, commit1)
    section2 = extract_section(source2, section_id, commit2)

    tempdir = pathlib.Path(tempfile.mkdtemp(prefix='html-diff-'))

    file_path1 = tempdir / commit1
    file_path2 = tempdir / commit2

    with file_path1.open('w') as f:
        f.write(source1[section1.start_index:section1.end_index])
    with file_path2.open('w') as f:
        f.write(source2[section2.start_index:section2.end_index])

    subprocess.run(('git', 'diff', '--no-index', '--color-words', file_path1, file_path2))
    shutil.rmtree(tempdir)

def get_source(commit: str) -> str:
    cmd = ('git', 'show', f'{commit}:source')
    try:
        return subprocess.check_output(cmd, encoding='utf-8')
    except subprocess.CalledProcessError:
        sys.exit(f'Command exited with a non-zero code: {cmd}')

def extract_section(source: str, section_id: str, commit: str) -> 'Section':
    for section in parse_sections(source):
        if section.id == section_id:
            return section

    print('error: could not find section', repr(section_id), 'in', commit)
    print('tip: use the `toc` command to view the available sections\n')
    print(USAGE)
    sys.exit(1)

@dataclass
class Section:
    level: int
    """ The level of the HTML heading tag. """
    id: str
    """ The identifier of the section (used to select it on the command-line.) """
    title: str
    """ The text of the heading tag with tags stripped and whitespace normalized. """
    start_index: int
    """ The start index of the section in the `source` string. """
    end_index: int
    """ The end index of the section in the `source` string. """

heading_regex = re.compile(r'^  <h([1-4])(?: split-filename="(.+?)")?.*?>((?:.|\n)+?)</h[1-4]>', re.MULTILINE)
tag_or_whitespace_regex = re.compile(r'</?[a-z].*?>')
superfluous_whitespace_regex = re.compile(r'\n| +')

def parse_sections(source: str):
    open_sections: list[Section] = []
    for m in heading_regex.finditer(source):
        level = int(m.group(1))
        inner_html = m.group(3)
        title = tag_or_whitespace_regex.sub('', inner_html)
        title = superfluous_whitespace_regex.sub(' ', title)
        section_id = m.group(2)

        if section_id is None:
            if title in ADDITIONAL_SECTIONS:
                section_id = title.lower().replace(' ', '-')
            else:
                continue

        closed_sections = []
        for idx, section in enumerate(open_sections):
            if section and section.level >= level:
                section.end_index = m.start()
                yield section
                closed_sections.append(idx)
        for idx in reversed(closed_sections):
            del open_sections[idx]

        open_sections.append(Section(level, section_id, title, m.start(0), 0))

    for section in open_sections:
        section.end_index = len(source)
        yield section

if __name__ == '__main__':
    main()
