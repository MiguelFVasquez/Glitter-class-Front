export function showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    alert(`${type.toUpperCase()}: ${message}`);
}
  