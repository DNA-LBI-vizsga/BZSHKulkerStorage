import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { UserService } from '../../services/user/user.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['loginUser', 'passwordChange']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [{ provide: UserService, useValue: mockUserService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});