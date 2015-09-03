//
// [The "BSD license"]
//  Copyright (c) 2012 Terence Parr
//  Copyright (c) 2012 Sam Harwell
//  Copyright (c) 2014 Eric Vergnaud
//  All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions
//  are met:
//
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
//  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
//  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

var DEFAULT_SEED = 0;
var c1 = 0xCC9E2D51;
var c2 = 0x1B873593;
var r1 = 15;
var r2 = 13;
var m = 5;
var n = 0xE6546B64;

var MurmurHash = {};

MurmurHash.multiply = function (a, b) {
    var aHigh = (a >> 16) & 0xffff
    var aLow = a & 0xffff
    var bHigh = (b >> 16) & 0xffff
    var bLow = b & 0xffff
    var high = ((aHigh * bLow) + (aLow * bHigh)) & 0xffff
    return (high << 16) + (aLow * bLow)
}

MurmurHash.initialize = function (seed) {
    return (seed === undefined) ? DEFAULT_SEED : seed;
};

MurmurHash.update = function (hash, value) {
    value = MurmurHash.multiply(value, c1);
    value = (value << r1) | (value >>> (32 - r1));
    value = MurmurHash.multiply(value, c2);

    hash = hash ^ value;
    hash = (hash << r2) | (hash >>> (32 - r2));
    return ((MurmurHash.multiply(hash, m)) + n) & 0xffffffff;
};

MurmurHash.updateObject = function (hash, obj) {
    return MurmurHash.update(hash, (obj != null) ? obj.hashCode() : 0);
};

MurmurHash.finish = function (hash, numWords) {
    hash = hash ^ (numWords * 4);
    hash = hash ^ (hash >>> 16);
    hash = MurmurHash.multiply(hash, 0x85EBCA6B);
    hash = hash ^ (hash >>> 13);
    hash = MurmurHash.multiply(hash, 0xC2B2AE35);
    hash = hash ^ (hash >>> 16);
    return hash;
};

MurmurHash.hashArray = function (items, seed) {
    var hash = MurmurHash.initialize(seed);
    var numItems = items.length;
    for (var idx = 0; idx < numItems; ++idx)
    {
        hash = MurmurHash.update(hash, items[idx]);
    }
    hash = MurmurHash.finish(hash, numItems);
    return hash;
};

exports.MurmurHash = MurmurHash;
