import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { MenuResponse } from 'src/app/shared/interfaces/menu';
import { HeaderService } from 'src/app/shared/services/header/header.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public menuArr: Array<MenuResponse> = [];

  constructor(
    private menuService: MenuService,
    private headerService: HeaderService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.getMenu();
  }

  getMenu() {
    this.menuService.getAll().subscribe((data) => {
      this.menuArr = data as MenuResponse[];

      this.menuArr.forEach((menu) => {
          menu.menuName =
          menu.menuName.charAt(0).toUpperCase() +
          menu.menuName.slice(1).toLowerCase();
      });

      this.menuArr.sort((a, b) => a.menuindex - b.menuindex);
    });
  }

  onSelectItem(item: string): void {
    this.headerService.emitHeaderClick(item);
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  reload() {
    window.location.href = '/';
  }
}
