import {Component, ElementRef, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventEmitter} from '@angular/core';

@Component({
    selector: 'app-enter-amount',
    templateUrl: './enter-amount.component.html',
    styleUrls: ['./enter-amount.component.scss']
})
export class EnterAmountComponent implements OnInit {
    isProcessing;
    amountForm: FormGroup;
    @Output() currentStep: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    public orderParams;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.isProcessing = true;
        this.amountForm = this.fb.group({
            converter: this.fb.group({
                'amountIn': ['', [
                    Validators.required
                ]],
                'currencyIn': ['', [
                    Validators.required
                ]],
                'amountOut': ['', [
                    Validators.required
                ]],
                'currencyOut': ['', [
                    Validators.required
                ]],
            }),
            // 'agreement': ['', [(control) => {
            //     return !control.value ? {'required': true} : null;
            // }]]
        });
        this.amountForm.valueChanges.subscribe((form) => {
          this.orderParams.currencyIn = form.converter.currencyIn;
          this.orderParams.amountIn = form.converter.amountIn;
          this.orderParams.currencyOut = form.converter.currencyOut;
          this.orderParams.amountOut = form.converter.amountOut;
          if (this.orderParams.amountOut && this.orderParams.amountIn) {
            this.orderParams.rate = this.orderParams.amountOut / this.orderParams.amountIn;
          }
        });
    }

    changeStep(event) {
        this.currentStep.emit(event);
    }
}
