export function showAlert(message: string, type: 'success' | 'error' | 'warning'): void {
  const alertBox = document.createElement('div');
  alertBox.className = `custom-alert ${type}`;
  alertBox.innerText = message;
  console.log('Clase aplicada:', alertBox.className); // << Aquí
  document.body.appendChild(alertBox);

  // Autoeliminar después de 3 segundos
  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}
