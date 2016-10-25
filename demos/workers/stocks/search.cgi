#!/usr/bin/perl -wT
use strict;
my $query = $ENV{QUERY_STRING};

print "Content-Type: text/plain\r\n\r\n";

my $symbols = {
    'Goodger' => 'GOAT',
    'Google' => 'GOOG',
    'Go' => 'GO',
    'Activision' => 'ATVI',
    'Apple' => 'AAPL',
    'Applications' => 'APLS',
    'Cats' => 'MOWMOW',
};

foreach my $key (values %$symbols) {
    $symbols->{$key} = $key;
}

my $results = {};

# 'GOAT' matches 'GOO' because it actually matches 'Goodger'

foreach my $key (keys %$symbols) {
    if (lc substr($key, 0, length($query)) eq lc $query) {
        $results->{$symbols->{$key}} = 1;
    }
}

my @results = sort keys %$results;

print join(' ', @results);
