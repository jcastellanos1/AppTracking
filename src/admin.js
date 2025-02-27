document.addEventListener("DOMContentLoaded", function() {
    const ordersList = document.getElementById("ordersList");
  
    // Cargar pedidos del administrador
    loadOrders();
  
    // Función para cargar pedidos
    function loadOrders() {
      fetch("http://localhost:8080/api/pedidos", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
      .then(response => response.json())
      .then(data => {
        ordersList.innerHTML = "";
        data.forEach(order => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item");
          listItem.innerHTML = `${order.comida} x${order.cantidad} - Estado: ${order.estado} <button class="btn btn-warning btn-sm" onclick="changeStatus(${order.id}, 'preparando')">Preparando</button>`;
          ordersList.appendChild(listItem);
        });
      })
      .catch(err => console.error(err));
    }
  
    // Cambiar estado del pedido
    window.changeStatus = function(id, estado) {
      fetch(`http://localhost:8080/api/pedidos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ estado: estado })
      })
      .then(response => response.json())
      .then(data => {
        loadOrders();  // Actualiza la lista de pedidos
      })
      .catch(err => console.error(err));
    }
  });
  