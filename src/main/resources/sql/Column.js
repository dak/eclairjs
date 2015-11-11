/*
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A column in a DataFrame.
 * @constructor
 */
var Column = function(jvmColumn) {
	var jvmObj = jvmColumn;
    this.logger = Logger.getLogger("Column_js");
    JavaWrapper.call(this, jvmObj);
};

Column.prototype = Object.create(JavaWrapper.prototype); 

//Set the "constructor" property to refer to Column
Column.prototype.constructor = Column;

/**
 * Equality test
 * @param {object}
 * @returns {Column}
 */
Column.prototype.equalTo = function(obj) {
    return new Column(this.getJavaObject().equalTo(obj));
};