export function showAlert(message: string, type: 'success' | 'error' | 'warning'): void {
  const alertBox = document.createElement('div');
  alertBox.className = `custom-alert ${type}`;
  alertBox.innerText = message;
  
  // Crear contenedor de alertas si no existe
  let alertContainer = document.getElementById('alert-container');
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.className = 'alert-container';
    document.body.appendChild(alertContainer);
  }
  
  // Agregar la nueva alerta al contenedor
  alertContainer.appendChild(alertBox);
  
  // Autoeliminar después de 1.5 segundos
  setTimeout(() => {
    alertBox.remove();
    // Eliminar el contenedor si no hay más alertas
    if (alertContainer && alertContainer.children.length === 0) {
      alertContainer.remove();
    }
  }, 3000);
}