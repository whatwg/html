#!/usr/bin/perl -wT
use strict;
my $stock = $ENV{QUERY_STRING};

print "Content-Type: text/plain\r\n\r\n";

my $data = {
    'GOAT' => 1000,
    'GOOG' => 600,
    'GO' => 300,
    'ATVI' => 100,
    'AAPL' => 200,
    'APLS' => 1,
    'MOWMOW' => 10000,
};

if (exists($data->{$stock})) {
    print $data->{$stock} * (rand()+0.5);
} else {
    print 0;
}
