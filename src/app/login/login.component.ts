import { AfterViewInit, OnDestroy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FireLoginService } from './fireauth-login';
import { ListenersService } from '../services/listeners.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserService } from '../services/user.service';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';
import { DataImg, penguin } from '../constantsImg';
import { User } from './user';

export enum Tabs{
  Login = "Login",
  SignUp = "Sign-up",
  Profile = "Profile",
}

export enum FormData{
  email = "email",
  username = "username",
  password = "password",
  passCheck = "passCheck",
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent extends FireLoginService implements OnDestroy{
  @Input() isShowDialog: boolean = false;
  private currentUser: User = new User();
  static currentUuid: string = "";
  imageProfile: DataImg = penguin;
  form!: FormGroup;
  tabs = Object.values(Tabs);
  isShowPassword : boolean = false;
  rememberMe :boolean = true;
  isLogin: boolean = false;
  currentTab = Tabs.Login;
  msgError: string = "";

  constructor(private fb: FormBuilder, private dialog: MatDialog, private userAth: Auth, private user: UserService) {
    super(userAth);
    this.listenerClose();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passCheck : [''],
      username: [''],
    });
    this.injectUser();
  }
  
  get email() {
    return this.form.get(FormData.email);
  }

  get password() {
    return this.form.get(FormData.password);
  }

  get username(){
    return this.form.get(FormData.username);
  }

  get passwordCheck(){
    return this.form.get(FormData.passCheck);
  }   

  submit() {
    const passRef = this.form.get('password');
    const emailRef = this.form.get('email');
    const email = this.form.value.email;
    const password = this.form.value.password;

    switch(this.currentTab){
      
      case Tabs.Login:
        if(passRef?.valid && emailRef?.valid){
          this.openRememberMeAlert(() => this.loginUser(email, password, this.rememberMe))
        }
        break;
        
      case Tabs.SignUp:
        if (this.form.valid && this.isCheckPass()) {
          const username = this.form.value.username;
          this.openRememberMeAlert(()=> this.registerUser(email, password, username));
        }
        break;

      case Tabs.Profile:
        this.currentTab = Tabs.Login;
        this.logout();
        this.clear();
        this.imageProfile = penguin;
        break;
      }
  }

  async loginUser(email: string, password: string, rememberMe: boolean){
    await this.login({email, password}, rememberMe).then(() => {
      this.isLogin = true;
      const uuid = this.getCurrentUser()?.uid;
      if(uuid) {
        this.injectUser();
      }
      this.msgError = "";
      })
      .catch((error) => {
        this.msgError = "No existe la cuenta";
      });
  }

  async registerUser(email: string, password: string, username: string){
    await this.register({email, password}, this.rememberMe).then(async () => {
      this.isLogin = true;
      const uuid = this.getCurrentUser()?.uid;
      if(uuid) {
        LoginComponent.currentUuid = uuid;
        this.currentUser = new User();
        this.currentUser.setEmail(email);
        this.currentUser.setUUid(uuid);
        this.currentUser.setUserName(username);
        this.currentUser.setImage(penguin);
        await this.user.addUser(this.currentUser);
      }
      this.msgError = "";
    })
    .catch((error) => {
      const regex = /\bFirebase\S*\b|[:().]/gi;
      this.msgError = error.toString().replace(regex, '');
    });
  }

  async injectUser(){
    const uuid = this.getUuid();
    if( uuid != ''){   
      LoginComponent.currentUuid = uuid;
      await this.user.getUser(uuid).then(user=>{
        this.form.patchValue({
          email: user.get('email'),
          username: user.get('username'),
        });
        this.isLogin = true;
        this.currentTab = Tabs.Profile;
        this.currentUser = new User();
        this.currentUser.setEmail(user.get('email'));
        this.currentUser.setUserName(user.get('username'));
        this.currentUser.setUUid(uuid);
        if(user.get('image')){
          this.currentUser.setImage(user.get('image'));
          this.imageProfile = this.currentUser.getImage();
        }
        ListenersService.getInstance().setListenerUser(this.getLoggedInUser());
      });
    }
  }

  openRememberMeAlert(func: () => {}): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { rememberMe: this.rememberMe, type: 'login' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.rememberMe = result;
        func();
      }
    });
  }

  setCurrentTab(tab: MatTabChangeEvent){
    this.currentTab = this.tabs.filter(elem=> elem == tab.tab.textLabel)[0];
    this.currentTab != Tabs.Profile && this.clear();
  }

  onChangeImg(event: DataImg){
    if(event && this.currentUser){
      this.imageProfile = event;
      this.currentUser.setImage(this.imageProfile);
      this.user.updateUser(this.getUuid(), this.currentUser)
    }
  }
  
  isCheckPass():boolean{
    const passCheck = this.form.value.passCheck;
    const password = this.form.value.password;
    return passCheck === password;
  }

  showPassword(){
    this.isShowPassword = !this.isShowPassword;
  }

  private listenerClose(){
      ListenersService.getInstance().addListenerClose().subscribe((close)=>{
        if(this.isLogin) this.closePopup();
      });
  }

  private clear(){
    this.isLogin = false;
    this.form.reset()
    this.msgError = "";
  }

  public closePopup(){
    this.isShowDialog = false;
  }

  ngOnDestroy(): void {}
}
