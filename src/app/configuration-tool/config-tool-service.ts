import { Injectable } from '@angular/core';
import { } from '@angular/http'
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import 'rxjs/Observable';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from 'selenium-webdriver/http';
import { ResponseType, ResponseContentType } from '@angular/http/src/enums';
import { Http } from '@angular/http/src/http';


interface VisibleWhen {
    isOn: boolean,
    operator?: string,
    fields?: [
        {
            name: string,
            values: any[]
        }
    ]
}

interface RawWorkType {
    WorkType: string,
}

interface workType {
    id: number,
    name: string,
    icon: string,
}

interface RawWorkTypeToForm {
    WorkTypeName: string,
    formName: string
}

interface WorkTypeToForm {
    WorkTypeName: string,
    formNames: string[]
}

interface RawForm {
    moduleName: string
    formName: string,
}

interface Form {
    id: number,
    name: string,
    icon: string,
    moduleId: number,
    groupId: number,
    order: number,
    visibleWhen: VisibleWhen
}


interface Options {
    key: string,
    options: string[]
}

interface Section {
    id: number,
    name: string,
    enable: boolean,
    order: number
}

interface SectionToForm {
    sectionId: number,
    formId: number
}

interface RawField {
    formName: string,
    dependency: string,
    order: string,
    name: string,
    type: string,
    optionListName: string,
    length: string,
    isMandatory: string,
    esriPosition: string
}

interface Field {
    name: string,
    title: string,
    readOnly: boolean,
    typeId: number,
    sectionId: number,
    esriName: string,
    mandatory: boolean,
    editOnly: boolean,
    length: number,
    order: number
    visibleWhen: VisibleWhen
}

enum SheetsNames {
    workTypes = 0,
    mandatoryForms = 1,
    customForms = 2,
    workTypeToForms = 3,
    formFields = 4,
    mappingFields = 5,
    L1Fields = 6,
    options = 7
}

export interface IConfigToolService {
    getWorkType(): any;
    getForms(): any;
    getSections(): any;
    getSectionToForms(): any;
    getFields(): any;
}

@Injectable()
export class ConfigToolService implements IConfigToolService {

    public _xmlHttp: XMLHttpRequest;

    private workType: workType[] = [];
    private forms: Form[] = [];
    private workTypeToForm: WorkTypeToForm[] = [];
    private sections: Section[] = [];
    private sectionToForms: SectionToForm[] = [];
    private fields: Field[] = [];
    private options: Options[] = [];



    private initializeId = 1001;


    constructor() {

        this.setAllDataFromExel();

    }

    getWorkType(): any {
        return this.workType;
    }

    getForms(): any {
        return this.forms;
    }

    getSections(): any {
        return this.sections;
    }

    getSectionToForms(): any {
        return this.sectionToForms;
    }

    getFields(): any {
        return this.fields;
    }

    getOptions(): any {
        return this.options;
    }

    private setAllDataFromExel() {
        this.getExelFile("../assets/exel9.xlsx");

    }

    private getExelFile(filePath: string) {
        var _xmlHttp = new XMLHttpRequest();
        _xmlHttp.addEventListener("load", (e) => { this.onLoadFile(e, _xmlHttp) });
        _xmlHttp.responseType = "arraybuffer";
        _xmlHttp.open("GET", filePath, true);
        _xmlHttp.send();

    }

    private getRawData(arraybuffer: any) {
        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) {
            arr[i] = String.fromCharCode(data[i]);
            //  console.log("Data"+data[i]);
        }
        var bstr = arr.join("");

        var workbook = XLSX.read(bstr, { type: "binary" });
        //console.log("Data"+bstr);
        var rawJsons = [];

        _.forEach(workbook.SheetNames, (s, index) => {
            rawJsons.push(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[index]], { header: 1, raw: true }))
        });
        return rawJsons;

    }


    private onLoadFile(e: any, xMLHttpRequest: XMLHttpRequest) {
        var rawJson = this.getRawData(xMLHttpRequest.response);

        var rawWorkType: RawWorkType[] = this.getRawWorkType(rawJson[SheetsNames.workTypes]);
        this.populateWorkType(rawWorkType);

        var rawWorkTypeToForm: RawWorkTypeToForm[] = this.getRawWorkTypeToForm(rawJson[SheetsNames.workTypeToForms]);
        this.populateWorkTypeToForm(rawWorkTypeToForm)

        var rawForms: RawForm[] = this.getRawForms(rawJson[SheetsNames.mandatoryForms]);
        this.populateForms(rawForms);

        var rawForms: RawForm[] = this.getRawForms(rawJson[SheetsNames.customForms]);
        this.populateForms(rawForms);


        this.populateSections();
        this.populateSectionsToForms();

        var rawFields: RawField[] = this.getRawField(rawJson[SheetsNames.formFields]);
        this.populateFields(rawFields, SheetsNames.formFields);

        var rawFields: RawField[] = this.getRawField(rawJson[SheetsNames.mappingFields]);
        this.populateFields(rawFields, SheetsNames.mappingFields);

        var rawFields: RawField[] = this.getRawField(rawJson[SheetsNames.L1Fields]);
        this.populateFields(rawFields, SheetsNames.L1Fields);

        this.setOptions(rawJson[SheetsNames.options]);

    }

    private populateWorkType(rawWorkType) {

        _.forEach(rawWorkType, (w, index) => {
            this.workType.push(
                {
                    id: index,
                    name: w.WorkType,
                    icon: null,
                }
            )
        })

    }

    private populateWorkTypeToForm(rawWorkTypeToForm) {
        _.forEach(rawWorkTypeToForm, (r) => {

            var relevantWorkTypeIndex = _.findIndex(this.workTypeToForm, w => {
                return r.WorkTypeName.toLowerCase() == w.WorkTypeName.toLowerCase()
            });
            if (relevantWorkTypeIndex > -1) {
                this.workTypeToForm[relevantWorkTypeIndex].formNames.push(r.formName);
            } else {
                this.workTypeToForm.push({
                    WorkTypeName: r.WorkTypeName,
                    formNames: [r.formName]
                })
            }
        });
    }

    private populateForms(rawForm: RawForm[]) {
        _.forEach(rawForm, (f, index) => {
            this.forms.push(
                {
                    id: this.getFormId(f.formName, index),
                    name: f.formName,
                    icon: null,
                    moduleId: this.getmoduleId(f.moduleName),
                    groupId: this.getGroupId(f.moduleName),
                    order: index + this.initializeId,
                    visibleWhen: this.getFormDependency(f.formName)
                }
            )
        })
    }

    private getFormId(name: string, index: number): number {
        switch (name) {
            case "PipesAndFitting":
                return 5;
            case "Casing":
                return 6;
            case "SqueezeOff":
                return 7;
            case "MaterialList":
                return 8;
            case "TieIn":
                return 9;
            case "MarkerBall":
                return 10;
            case "SteelPlate":
                return 11;
            case "ReferenceLine":
                return 12;
            case "ReferencePoint":
                return 13;
            case "ExistingPoint":
                return 14;
            case "ExistingLine":
                return 15;
            case "RFID":
                return 16;
            case "Project":
                return 17;
            case "Bore":
                return 41;
        }
        return index + this.initializeId;

    }

    private populateSections() {
        _.forEach(this.forms, (f, index) => {
            this.sections.push(
                {
                    id: f.id,
                    name: f.name,
                    enable: true,
                    order: f.id
                }

            )
        })
    }

    private populateSectionsToForms() {
        _.forEach(this.forms, (f, index) => {
            this.sectionToForms.push(
                {
                    sectionId: this.sections[index].id,
                    formId: f.id
                }

            )
        })
    }

    private populateFields(rawFields: RawField[], sheetsNames: SheetsNames) {
        _.forEach(rawFields, i => {

            this.fields.push({
                title: i.name,
                name: this.getFieldName(i.name),
                typeId: this.getfieldType(i.type),
                sectionId: this.getSectionId(i.formName, sheetsNames),
                editOnly: false,
                esriName: i.esriPosition,
                length: 50,
                mandatory: this.isFieldMandatory(i.isMandatory),
                readOnly: false,
                order: parseInt(i.order),
                visibleWhen: this.getFieldDependency(i.dependency)

            })

        })
    }

    private getGroupId(value: string) {
        switch (value) {
            case "mapping":
                return 11;
            case "forms":
                return 22;
            case "l1":
                return 10
        }
    }

    private getmoduleId(value: string) {
        switch (value) {
            case "mapping":
                return 1;
            case "forms":
                return 4;
            case "l1":
                return 1
        }
    }

    private getRawWorkType(rawJson: any): RawWorkType[] {
        var result: RawWorkType[] = [];
        _.forEach(rawJson, (i) => {
            if (this.isFieldValid(i[0])) {
                result.push({
                    WorkType: i[0]
                })
            }
        })
        return result;
    }

    private getRawForms(rawJson: any): RawForm[] {
        var result: RawForm[] = [];
        _.forEach(rawJson, (i) => {
            if (this.isFieldValid(i[0])) {
                result.push({
                    moduleName: i[0],
                    formName: i[1]
                });
            }
        })
        return result;
    }

    private getRawWorkTypeToForm(rawJson: any): RawWorkTypeToForm[] {
        var result: RawWorkTypeToForm[] = [];
        _.forEach(rawJson, (i) => {
            if (this.isFieldValid(i[0])) {
                result.push({
                    WorkTypeName: i[0],
                    formName: i[1],
                });
            }
        })
        return result;
    }

    private getRawField(rawJson: any): RawField[] {
        var result: RawField[] = [];
        _.forEach(rawJson, (i) => {
            i = <string>i
            result.push({
                formName: i[0],
                dependency: i[1],
                order: i[2],
                name: i[3],
                type: i[4],
                optionListName: i[5],
                length: i[6],
                isMandatory: i[7],
                esriPosition: i[8]

            })
        })
        return result;
    }


    private setOptions(rawJson: any) {
        var result: Options[] = [];

        rawJson[0].forEach(element => {
            result.push({
                key: this.getFieldName(element),
                options: []
            });
        });
        for (var i = 1; i < rawJson.length; i++) {
            for (var k = 0; k < rawJson[i].length; k++) {
                if (this.isFieldValid(rawJson[i][k])) {
                    result[k].options.push(rawJson[i][k])
                }
            }
        }

        this.options = result;
    }

    private isFieldMandatory(val: string) {
        return val == "V" ? true : false;
    }


    private getfieldType(val: string): number {
        switch (val) {
            case "date/time":
                return 3;
            case "list":
                return 5;
            case "checkbox":
                return 4;
            case "text":
                return 1;
            case "number":
                return 2;
            case "photo":
                return 10;
            case "selection":
                return 12;
            case "list multiselect":
                return 13;
            case "multiline text":
                return 7;
        }
    }

    private getFieldName(name: string) {
        return name
            .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
            .replace(/\s/g, '')
            .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
    }

    private getFormDependency(formName: string): VisibleWhen {

        var dependencyIds: number[] = [];
        var isOn = false;
        _.forEach(this.workTypeToForm, (w, index) => {

            var name = _.find(w.formNames, i => {
                return i.toLowerCase() == formName.toLowerCase();
            });
            if (name) {
                if (w.WorkTypeName == "All") {
                    isOn = true;
                } else {
                    var relevantWorkTypeObj = _.find(this.workType, (t) => {
                        return t.name == w.WorkTypeName;
                    })
                    if (relevantWorkTypeObj)
                        dependencyIds.push(relevantWorkTypeObj.id)
                }
            }
        });
        if (isOn) {
            return {
                isOn: true
            }
        }
        switch (dependencyIds.length) {
            case 0:
                return {
                    isOn: false
                }

            case this.workType.length:
                return {
                    isOn: true
                }
            default:
                return {
                    isOn: null,
                    operator: "and",
                    fields: [
                        {
                            name: "workType",
                            values: dependencyIds
                        }
                    ]
                }
        }
    }

    private getFieldDependency(val: string): VisibleWhen {
        if (this.isFieldValid(val) && val.length > 0) {
            var splitVal = val.split("=");
            var dependencyName = this.getFieldName(splitVal[0]);
            var dependencyValue = [splitVal[1]];
            return {
                isOn: null,
                operator: "and",
                fields: [
                    {
                        name: dependencyName,
                        values: dependencyValue
                    }
                ]
            }

        } else {
            return {
                isOn: true,
            }
        }
    }

    private isFieldValid(val: any) {
        if (val == null || val == undefined)
            return false
        return true
    }

    private getSectionId(formName: string, sheetsName: SheetsNames) {
        var moduleId: number;
        switch (sheetsName) {
            case SheetsNames.L1Fields:
                return 17;
            case SheetsNames.mappingFields:
                moduleId = 1;
                break;
            case SheetsNames.formFields:
                moduleId = 4;
                break;

        }
        if (this.isFieldValid(formName)) {
            var relevantForm = _.find(this.forms, (f) => {
                return f.name.toLowerCase() == formName.toLowerCase() && f.moduleId == moduleId;
            });
            if (relevantForm) {
                return relevantForm.id
            } else {
                console.error("Cant find relevant section ID")
                return -1
            }

        } else
            return -1
    }
}
