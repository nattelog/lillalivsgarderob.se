/*
   FieldController. A very awesome way of handling form-fields
   in HTML.

   Author: Natanael Log, October 2015.
*/

function FieldController(_label, _altLabel){

    /* Fields. */

    this.model = null;
    this.modelRule = null;

    this.label = _label || null;

    this.altLabel = _altLabel || null;
    this.altLabelRule = null;

    this.placeholder = null;
    this.placeholderRule = null;

    this.required = false;

    /* This function will make the labels a little more
       HTML-id-friendly. No non-english letters or spaces.
       Oh, and it will turn the label into camelCase. */
    this.getId = function(){
        var _label = this.label.toLowerCase();
        _label = this.trim(_label);
        var _arr = _label.split(/\s/);
        var _first = true;

        for (var i = 0; i < _arr.length; i++){
            if (_arr[i] != "") {
                if (_first)
                    _first = false;
                else
                    _arr[i] = _arr[i].substr(0, 1).toUpperCase() +
                        (_arr[i].length > 1 ? _arr[i].substr(1) : "");
            }
        }
        return _arr.join("");
    };

    this.getTrimmedModel = function(){
        return this.trim(this.model);
    };

    this.getPlaceholder = function(){
        if (!this.placeholderRule)
            return this.placeholder;
        else
            return this.placeholderRule();
    };

    this.isValid = function(){
        if (this.required)
            return !_isEmpty(this.model) && (!this.modelRule || this.modelRule(this.model));
        else
            return !this.modelRule || this.modelRule(this.model);
    };

    this.showAlt = function(){
        if (!this.altLabelRule)
            return true;
        else
            return this.altLabelRule();
    };

    this.resetModel = function(){
        this.model = null;
    };

    /* Some helpers. */

    /* Removes all spaces at the beginning and the end of 'text'. */
    this.trim = function(text){
        var _text = text;

        /* Removing spaces in beginning. */;
        while (_text[0] == " ")
            _text = _text.slice(1);

        /* Removing spaces in the end. */
        while (_text[_text.length-1] == " ")
            _text = _text.slice(0, _text.length-1);

        return _text;
    };

    this.trimTest = function(text){
        return this.trim(text);
    };

    var _isEmpty = function(value){
        return (!value || value.length === 0);
    };
};