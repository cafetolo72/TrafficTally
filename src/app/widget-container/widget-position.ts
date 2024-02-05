import { Database } from '../services/db/database';

export class WidgetPositionService {
  private static readonly localStorageKey = 'widgetPositions';
  private static widgetPositions: { [key: string]: {left: number, top: number, width: string, height: string, isMax : boolean } } = {};

  constructor() {}

  static async load(){
    const storedPositions = Database.getItem(WidgetPositionService.localStorageKey);
    if (storedPositions) {
      WidgetPositionService.widgetPositions = JSON.parse(storedPositions);
    }
  }

  static async addWidgetComponent(id: string, left: number, top: number, width : string, height : string, isMax : boolean): Promise<void> {
    WidgetPositionService.widgetPositions[id] = {left, top, width, height, isMax };
    this.saveToLocalStorage();
  }

  static async getWidgetComponentPosition(id : string): Promise<{ left: number; top: number; width : string; height : string; isMax : boolean } | undefined> {
    return WidgetPositionService.widgetPositions[id];
  }

  private static saveToLocalStorage(): void {
    Database.saveWidget(this.localStorageKey, this.widgetPositions);
  }
}
