export class TimerComponent {
  private startTime: number = 0;
  private endTime: number = 0;
  private running: boolean = false;
  private timerInterval: any;
  private static INSTANCE: TimerComponent;

  public constructor(){}

  public getInstance(): TimerComponent{
      if(TimerComponent.INSTANCE == null){
        TimerComponent.INSTANCE = new TimerComponent();
      }
      return TimerComponent.INSTANCE;
  }

  start() {
    if (this.running) {
      return;
    }
    this.startTime = Date.now();
    this.running = true;
    this.timerInterval = setInterval(() => {}, 1000);
  }
  
  stop() {
    if (!this.running) {
      return;
    }
    this.endTime = Date.now();
    this.running = false;
    clearInterval(this.timerInterval);
  }

  reset() {
    this.startTime = 0;
    this.endTime = 0;
    this.running = false;
  }

  public getTime(): string{
    return this.format(this.endTime - this.startTime);
  }

  private format(milliseconds: number): string{
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
