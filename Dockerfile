FROM debian:sid

## dependency installation: apache, wattsi, and other build tools
## enable some apache mods (the ln -s lines)
## install wattsi from specific version of repo
## cleanup freepascal since it is no longer needed after wattsi build
RUN apt-get update && \
    apt-get install -y ca-certificates curl git python subversion unzip libxml-parser-perl fp-compiler-3.0.0 apache2 && \
    cd /etc/apache2/mods-enabled && \
    ln -s ../mods-available/headers.load && \
    ln -s ../mods-available/expires.load && \
    git clone https://github.com/whatwg/wattsi.git /whatwg/wattsi && \
    cd /whatwg/wattsi && \
    git reset --hard 351df15 && \
    /whatwg/wattsi/build.sh && \
    cp /whatwg/wattsi/bin/wattsi /bin/ && \
    apt-get purge -y fp-compiler-3.0.0 && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

## get a known good version of the build repo
RUN git clone https://github.com/whatwg/html-build.git /whatwg/build
WORKDIR /whatwg/build
RUN git reset --hard c37f28ad

ADD . /whatwg/html

## build and copy assets to final apache dir
RUN /whatwg/build/build.sh && \
    rm -rf /var/www/html && \
    mv /whatwg/build/output /var/www/html && \
    cp /whatwg/html/site.conf /etc/apache2/sites-available/000-default.conf

CMD ["apache2ctl", "-DFOREGROUND"]
