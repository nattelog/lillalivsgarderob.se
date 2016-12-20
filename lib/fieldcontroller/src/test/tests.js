/**
 * Created by nattelog on 2015-10-19.
 */

QUnit.test("Trim test", function(assert){
    var fc = new FieldController();
    assert.equal(fc.trimTest("  Hello, madame  "), "Hello, madame", "Trim should work.");
});


QUnit.test("Constructor test", function(assert){
    var fc = new FieldController("Label");
    assert.equal(fc.label, "Label", "Label should be 'Label'");
    assert.notOk(fc.altLabel, "There should not be an altLabel defined.");

    fc.altLabel = "AltLabel";
    assert.equal(fc.altLabel, "AltLabel", "AltLabel should be 'AltLabel'.");
});


QUnit.test("ID test", function(assert){
    var fc = new FieldController("Label");
    assert.equal(fc.getId(), "label", "The ID should be 'label'.");

    fc.label = "Label With Spaces";
    assert.notEqual(fc.getId(), "LabelWithSpaces", "camelCase seems to work.");
    assert.equal(fc.getId(), "labelWithSpaces", "camelCase seems to still work.");
});


QUnit.test("Valid test", function(assert){
    var fc = new FieldController("Label With Spaces");
    fc.model = "A value";
    assert.ok(fc.isValid(), "A non-set validRule should always be true.");

    fc.modelRule = function(model){
        return model.length < 5;
    };

    assert.notOk(fc.isValid(), "Model length is > 5, so this should fail.");

    fc.modelRule = function(){
        return false;
    };

    assert.notOk(fc.isValid(), "This should fail.");
});


QUnit.test("AltLabel test", function(assert){
    var fc = new FieldController();

    assert.notOk(fc.altLabel, "AltLabel should not be defined.");

    fc.altLabel = "My alternative label."
    assert.ok(fc.altLabel, "AltLabel should be defined");

    var show = false;

    fc.altLabelRule = function(){
        return show;
    };

    assert.notOk(fc.showAlt(), "Alt should not be shown.");

    show = true;

    assert.ok(fc.showAlt(), "Alt should be shown.");
});


QUnit.test("Placeholder test", function(assert){
    var fc = new FieldController();

    fc.placeholder = "Placeholder 1";
    assert.ok(fc.getPlaceholder(), "Placeholder should be set.");

    var age = 15;

    fc.placeholderRule = function(){
        if (age < 18)
            return "Målsmans mail.";
        else
            return "";
    };

    assert.equal(fc.getPlaceholder(), "Målsmans mail.", "Placeholder should have changed.");

    age = 18;
    assert.equal(fc.getPlaceholder(), "", "Placeholder should be empty.");
});


QUnit.test("Personal code number test", function(assert){
    var fc = new FieldController();

    fc.modelRule = function(model){
        var _model = model.split("-");
        if (_model.length == 1) {
            if (_model[0].length == 10 || _model[0].length == 12)
                return !isNaN(_model[0]);
            else
                return false;

        } else if (_model.length == 2) {
            if ((_model[0].length == 6 || _model[0].length == 8) && _model[1].length == 4)
                return !isNaN(_model[0]) && !isNaN(_model[1]);
            else
                return false;

        } else
            return false;
    };

    fc.model = "9210014313";
    assert.ok(fc.isValid(), "9210014313 should be ok.");

    fc.model = "199210014313";
    assert.ok(fc.isValid(), "199210014313 should be ok.");

    fc.model = "921001-4313";
    assert.ok(fc.isValid(), "921001-4313 should be ok.");

    fc.model = "19921001-4313";
    assert.ok(fc.isValid(), "19921001-4313 should be ok.");

    fc.model = "92100-14313";
    assert.notOk(fc.isValid(), "92100-14313 should not be ok.");

    fc.model = "";
    assert.notOk(fc.isValid(), "Empty model should not be ok.");

    fc.model = "-92100-14313";
    assert.notOk(fc.isValid(), "-92100-14313 should not be ok.");

    fc.model = "921001-a313";
    assert.notOk(fc.isValid(), "921001-a313 should not be ok.");

    fc.model = "19921001a313";
    assert.notOk(fc.isValid(), "19921001a313 should not be ok.");
});

QUnit.test("Required test", function(assert){
    var fc = new FieldController();

    fc.required = true;
    assert.notOk(fc.isValid(), "Model is empty, so this should not pass.");

    fc.model = "Hej på dig!";
    assert.ok(fc.isValid(), "Model is set, so this should pass.");

    fc.modelRule = function(model){
        return model == "Hej på dig!";
    };

    assert.ok(fc.isValid(), "This should pass.");

    fc.model = "Hejdå på dig!";
    assert.notOk(fc.isValid(), "Model has changed from rule, so this should not pass.");

    fc.required = false;

    assert.notOk(fc.isValid(), "Required is false. But the rule should still be held.");

    fc.modelRule = null;
    fc.model = "";

    assert.ok(fc.isValid(), "This should pass.");

    fc.required = true;
    assert.notOk(fc.isValid(), "This should not pass.");

    fc.model = " ";
});