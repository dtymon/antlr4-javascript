function arrayToString(a) {
	return "[" + a.join(", ") + "]";
}

String.prototype.hashCode = function(s) {
	var hash = 0;
	if (this.length === 0) {
		return hash;
	}
	for (var i = 0; i < this.length; i++) {
		var character = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + character;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

function standardEqualsFunction(a,b) {
	return a.equals(b);
}

function standardHashFunction(a) {
	return a.hashCode();
}

function Set(hashFunction, equalsFunction) {
	this.data = {};
	this.hashFunction = hashFunction || standardHashFunction;
	this.equalsFunction = equalsFunction || standardEqualsFunction;
	return this;
}

Object.defineProperty(Set.prototype, "length", {
	get : function() {
		return this.values().length;
	}
});

Set.prototype.add = function(value) {
	var key = "hash_" + this.hashFunction(value);
	if(key in this.data) {
		var i;
		var values = this.data[key];
		for(i=0;i<values.length; i++) {
			if(this.equalsFunction(value, values[i])) {
				return values[i];
			}
		}
		values.push(value);
		return value;
	} else {
		this.data[key] = [ value ];
		return value;
	}
};

Set.prototype.addIfAbsent = function(value) {
    var key = "hash_" + this.hashFunction(value);
    var values = this.data[key];
    if (values == null)
    {
        this.data[key] = [ value ];
        return true;
    }

    var numValues = values.length;
    for (var idx = 0; idx < numValues; ++idx)
    {
        if (this.equalsFunction(value, values[idx]))
        {
            // Already present, no need to add
            return false;
        }
    }
    values.push(value);
    return true;
};

Set.prototype.contains = function(value) {
	var key = "hash_" + this.hashFunction(value);
	if(key in this.data) {
		var i;
		var values = this.data[key];
		for(i=0;i<values.length; i++) {
			if(this.equalsFunction(value, values[i])) {
				return true;
			}
		}
	}
	return false;
};

Set.prototype.values = function() {
	var l = [];
	for(var key in this.data) {
		if(key.indexOf("hash_")===0) {
			l = l.concat(this.data[key]);
		}
	}
	return l;
};

Set.prototype.toString = function() {
	return arrayToString(this.values());
};

function BitSet() {
    this.data = [];
    this.count = 0;
    return this;
}

BitSet.prototype.add = function(value) {
    if (!(value in this.data))
    {
        this.data[value] = true;
        ++this.count;
    }
};

BitSet.prototype.or = function(set) {
	var bits = this;
	Object.keys(set.data).map( function(alt) { bits.add(alt); });
};

BitSet.prototype.remove = function(value) {
    if (value in this.data)
    {
        delete this.data[value];
        --this.count;
    }
};

BitSet.prototype.contains = function(value) {
	return this.data[value] === true;
};

BitSet.prototype.values = function() {
	return Object.keys(this.data);
};

BitSet.prototype.minValue = function() {
	return Math.min.apply(null, this.values());
};

BitSet.prototype.hashCode = function () {
    var h = 1234;
    var values = Object.keys(this.data)
                       .sort(function (a, b) { return b - a });
    for (var idx = values.length; --idx >= 0;)
    {
        h ^= values[idx] * (idx + 1);
    }
    return ((h >> 32) ^ h) & 0xffffffff;
};

BitSet.prototype.equals = function(other) {
    if (this === other)
    {
        return true;
    }

    if (!(other instanceof BitSet))
    {
        return false;
    }

    if (this.count != other.count)
    {
        return false;
    }

    for (var key in this.data)
    {
        if (!(key in other.data))
        {
            return false;
        }
    }
    return true;
};

Object.defineProperty(BitSet.prototype, "length", {
	get : function() {
		return this.values().length;
	}
});

BitSet.prototype.toString = function() {
	return "{" + this.values().join(", ") + "}";
};

function AltDict() {
	this.data = {};
	return this;
}

AltDict.prototype.get = function(key) {
	key = "k-" + key;
	if(key in this.data){
		return this.data[key];
	} else {
		return null;
	}
};

AltDict.prototype.put = function(key, value) {
	key = "k-" + key;
	this.data[key] = value;
};

AltDict.prototype.values = function() {
	var data = this.data;
	var keys = Object.keys(this.data);
	return keys.map(function(key) {
		return data[key];
	});
};

function DoubleDict() {
	return this;
}

DoubleDict.prototype.get = function(a, b) {
	var d = this[a] || null;
	return d===null ? null : (d[b] || null);
};

DoubleDict.prototype.set = function(a, b, o) {
	var d = this[a] || null;
	if(d===null) {
		d = {};
		this[a] = d;
	}
	d[b] = o;
};


function escapeWhitespace(s, escapeSpaces) {
	s = s.replace("\t","\\t");
	s = s.replace("\n","\\n");
	s = s.replace("\r","\\r");
	if(escapeSpaces) {
		s = s.replace(" ","\u00B7");
	}
	return s;
}


exports.Set = Set;
exports.BitSet = BitSet;
exports.AltDict = AltDict;
exports.DoubleDict = DoubleDict;
exports.escapeWhitespace = escapeWhitespace;
exports.arrayToString = arrayToString;
