import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categories',
  standalone: true,
})
export class CategoriesPipe implements PipeTransform {

  transform(value: any, order: string[]): any {
    if (!value || !order) return value;

    return Object.keys(value)
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .reduce((obj : any, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
  }

}
