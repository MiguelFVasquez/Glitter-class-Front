import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
//Idusuario 
  get(key: string): string | null {
    return this.isBrowser() ? localStorage.getItem(key) : null;
  }

  set(key: string, value: string): void {
    if (this.isBrowser()) localStorage.setItem(key, value);
  }

  remove(key: string): void {
    if (this.isBrowser()) localStorage.removeItem(key);
  }

// IdRol
  setUserRole(role: number): void {
    this.set('userRole', role.toString());
  }

  /** Recupera el rol como número, o null si no existe o no es numérico */
  getUserRole(): number | null {
    const raw = this.get('userRole');
    if (raw === null) return null;
    const num = Number(raw);
    return isNaN(num) ? null : num;
  }

  /** Limpia el rol */
  removeUserRole(): void {
    this.remove('userRole');
  }

}
