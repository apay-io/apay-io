import {Component, ElementRef, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EventEmitter} from "@angular/core";

@Component({
    selector: 'app-enter-amount',
    templateUrl: './enter-amount.component.html',
    styleUrls: ['./enter-amount.component.scss']
})
export class EnterAmountComponent implements OnInit {
    isProcessing;
    amountForm: FormGroup;
    @Output() currentStep: EventEmitter<string> = new EventEmitter<string>();

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.isProcessing = true;
        this.amountForm = this.fb.group({
            converter: this.fb.group({
                'fromAmount': ['', [
                    Validators.required
                ]],
                'fromCurrency': ['', [
                    Validators.required
                ]],
                'toAmount': ['', [
                    Validators.required
                ]],
                'toCurrency': ['', [
                    Validators.required
                ]],
            }),
            'agreement': ['', [(control) => {
                return !control.value ? {'required': true} : null;
            }]]
        });
    }

    changeStep(event) {
        this.currentStep.emit(event);
    }
}
