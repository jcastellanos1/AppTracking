document.addEventListener("DOMContentLoaded", function() {
    const orderForm = document.getElementById("orderForm");
    const ordersList = document.getElementById("ordersList");
  
    // Manejar la creación de un nuevo pedido
    orderForm.addEventListener("submit", function(e) {
      e.preventDefault();
  
      const comida = document.getElementById("comida").value;
      const cantidad = document.getElementById("cantidad").value;
  
      fetch("http://localhost:8080/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer <tu_token_aqui>" // Reemplaza con tu token
        },
        body: JSON.stringify({
          comida: comida,
          cantidad: cantidad,
          estado: "pendiente"
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert("¡Pedido realizado!");
        loadOrders(); // Actualiza la lista de pedidos
      })
      .catch(err => console.error(err));
    });
  
    // Función para cargar los pedidos
    function loadOrders() {
      fetch("http://localhost:8080/api/pedidos", {
        method: "GET",
        headers: {
          "Authorization": "Bearer <tu_token_aqui>" // Reemplaza con tu token
        }
      })
      .then(response => response.json())
      .then(data => {
        ordersList.innerHTML = "";
        data.forEach(order => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item");
          listItem.innerHTML = `${order.comida} x${order.cantidad} - Estado: ${order.estado}`;
          ordersList.appendChild(listItem);
        });
      })
      .catch(err => console.error(err));
    }
  
    // Cargar los pedidos al inicio
    loadOrders();
  });
  