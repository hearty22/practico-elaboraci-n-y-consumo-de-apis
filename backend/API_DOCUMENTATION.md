# Documentación de la API - Listas

Esta documentación describe los endpoints disponibles para gestionar las listas.

## Prefijo de la Ruta

Todos los endpoints descritos a continuación están bajo el prefijo `/api/lists`.

---

## 1. Crear una Nueva Lista

Crea una nueva lista.

-   **Método:** `POST`
-   **Endpoint:** `/api/lists`
-   **Body (JSON):**
    -   `title` (string, **requerido**): El título de la nueva lista.

    **Ejemplo de Body:**
    ```json
    {
      "title": "Lista de la compra"
    }
    ```

-   **Respuesta Exitosa (201):**
    -   Retorna el objeto completo de la lista recién creada, incluyendo `id`, `items` (vacío por defecto), `createdAt` y `updatedAt`.

    **Ejemplo de Respuesta:**
    ```json
    {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Lista de la compra",
      "items": [],
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    }
    ```

---

## 2. Obtener Todas las Listas

Recupera un array con todas las listas existentes.

-   **Método:** `GET`
-   **Endpoint:** `/api/lists`
-   **Body:** Ninguno.
-   **Respuesta Exitosa (200):**
    -   Retorna un array de objetos de lista.

    **Ejemplo de Respuesta:**
    ```json
    [
      {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Lista de la compra",
        "items": [],
        "createdAt": "2023-10-27T10:00:00.000Z",
        "updatedAt": "2023-10-27T10:00:00.000Z"
      },
      {
        "id": "60d21b4667d0d8992e610c86",
        "title": "Tareas del lunes",
        "items": [],
        "createdAt": "2023-10-27T11:00:00.000Z",
        "updatedAt": "2023-10-27T11:00:00.000Z"
      }
    ]
    ```

---

## 3. Obtener una Lista por ID

Recupera una única lista específica por su `id`.

-   **Método:** `GET`
-   **Endpoint:** `/api/lists/:id`
-   **Parámetros de URL:**
    -   `id` (string, **requerido**): El ID de la lista a obtener.
-   **Body:** Ninguno.
-   **Respuesta Exitosa (200):**
    -   Retorna el objeto de la lista solicitada.
-   **Respuesta de Error (404):**
    -   Si no se encuentra ninguna lista con ese ID.

---

## 4. Actualizar una Lista por ID

Actualiza el título de una lista existente.

-   **Método:** `PUT`
-   **Endpoint:** `/api/lists/:id`
-   **Parámetros de URL:**
    -   `id` (string, **requerido**): El ID de la lista a actualizar.
-   **Body (JSON):**
    -   `title` (string, **opcional**): El nuevo título para la lista.

    **Ejemplo de Body:**
    ```json
    {
      "title": "Lista de la compra semanal"
    }
    ```

-   **Respuesta Exitosa (200):**
    -   Retorna el objeto de la lista ya actualizada.
-   **Respuesta de Error (404):**
    -   Si no se encuentra ninguna lista con ese ID.

---

## 5. Eliminar una Lista por ID

Elimina permanentemente una lista.

-   **Método:** `DELETE`
-   **Endpoint:** `/api/lists/:id`
-   **Parámetros de URL:**
    -   `id` (string, **requerido**): El ID de la lista a eliminar.
-   **Body:** Ninguno.
-   **Respuesta Exitosa (204):**
    -   No retorna contenido.
-   **Respuesta de Error (404):**
    -   Si no se encuentra ninguna lista con ese ID.
