import { Observable, Subject } from "rxjs";

export class ListenersService {
    private closeEvent: Subject<boolean> = new Subject<boolean>();
    private userActive: Subject<any> = new Subject<any>();
    private cross: Subject<any> = new Subject<any[]>();
    private static INSTANCE : ListenersService;

    constructor(){}

    public static getInstance(): ListenersService{
      if(ListenersService.INSTANCE == null){
          ListenersService.INSTANCE = new ListenersService();
      }
      return ListenersService.INSTANCE;
    }

    public setListenerUser(user : any){
      if(this.userActive == null){
        this.userActive = new Subject<any>();
      }
      this.userActive.next(user);
    }

    public getListenerUser(): Observable<any>{
      return this.userActive.asObservable();
    }

    public listenerCross(cross: any, isRemove: boolean, mark?:L.Marker){
      this.cross.next({cross, isRemove, mark});
    }
    
    public getListenerCross(): Observable<any>{
      return this.cross.asObservable();
    }

    public eventCloseMap(){
      this.closeEvent.next(false);
    }

    public addListenerClose(): Observable<any> {
      return this.closeEvent.asObservable();
    }
}
