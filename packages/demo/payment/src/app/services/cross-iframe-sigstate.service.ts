import { Injectable } from '@angular/core';
import { addTrustedOrigins } from '@sigstate/cross-iframe';

@Injectable({
  providedIn: 'root',
})
export class CrossIframeSigstateService {
  constructor() {
    console.log('!! constructor angular');
    addTrustedOrigins(['http://localhost:3000', 'http://localhost:3002']);
  }
}
