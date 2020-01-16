import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroPage } from './intro';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@/app/shared.module';
import { RouterModule } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';


describe('IntroPage', () => {
  let component: IntroPage;
  let fixture: ComponentFixture<IntroPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [IntroPage],
      imports: [
        IonicModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot(),
        SharedModule,
        RouterModule.forRoot([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});