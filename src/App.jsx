import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { getPeople } from "./services/api";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Table,
} from "@chakra-ui/react";
import { loadPeople, savePeople, loadQuery, saveQuery } from "./utils/storage";

import { useEffect, useMemo, useState } from "react";
//useMemo sirve para memorizar valores y evitar recalculos innecesarios

function App() {

  // 1) Estado inicial desde localStorage (sin efectos)
  const initialPeople = (() => {
    const local = loadPeople();
    return Array.isArray(local) ? local : [];
  })();


  //query -> estado del filtro de búsqueda, inicializado desde storage
  const [query, setQuery] = useState(loadQuery()); // filtro recordado
  const [personas, setPersonas] = useState(initialPeople);
  const [isLoading,setIsLoading]= useState(true);
  // Acciones locales (no API) para practicar estado + persistencia
  function handleAdd() {
    const nueva = {
      id: Date.now(), // id temporal
      name: "Jose Ignacio",
      email: "JoseIgnacio@ejemplo.com",
      phone: "600 000 000",
    };

    const nueva2 = {
      id: Date.now() + 12, // id temporal
      name: "Maria Lopez",
      email: "mariaLo@ejemplo.com",
      phone: "600 000 000",
    };
    setPersonas((prev) => [nueva2, ...prev]);
  // Un solo setPersonas; el useEffect([personas]) salvará en localStorage
  //setPersonas((prev) => [nueva, nueva2, ...prev]);

    console.log("Añadida nueva persona",personas);
  }


    // 5) Filtro: derivamos una "vista" filtrada sin tocar el array original

    //utilizamos useMemo para memorizar el resultado del filtrado, es decir solo se recalcula cuando personas o query cambian
    //useMemo principalmente se usa para optimizar el rendimiento evitando recalculos innecesarios, a diferencia de useEffect que 
    // se usa para ejecutar efectos secundarios, por lo tanto cuando queremos derivar un valor basado en otros estados
    //  y optimizar el rendimiento, useMemo es la opción adecuada.

    //Luego q le hacemos trim y toLowerCase para evitar problemas con mayusculas y espacios
  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return personas;
    return personas.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q)
    );
  }, [personas, query]);

  {/*Para saber de donde saco los estilos de los componenetes de chakra ui
  https://chakra-ui.com/docs/components/table --> EN ESTE CASO ES LA TABLA PERO BUSCAS POR COMPONENTES DE TU ELECCIÓN 
  */}

  //Llegados a este punto ya tenemos que nuestra variable personas, guarda los datos de forma local pero no persistente,
  //para ello utilizamos useEffect para sincronizar el estado con localStorage

  // 3) useEffect para cargar la lista al montar

  //Para visualizar los datos guardados, nos vamos al DevTools -> Application -> Local Storage -> seleccionamos nuestra web
  useEffect(() => {
    savePeople(personas);
    console.log("Lista guardada en localStorage");
  }, [personas]);


  useEffect(() => {
    saveQuery(query);
  }, [query]);

  // Carga inicial: primero localStorage; si no hay, API

  useEffect(() => {
    async function loadInitial() {
      try{
        setIsLoading (true);

        const local = loadPeople(); //Esto puede devolver null por lo tanto comprobamos antes que sea un array para poder cargar los datos
        console.log("datos cargados de local", local);
        if(Array.isArray(local) && local.length>0){
          console.log("esto seteando")
          setPersonas(local);
        }else{
          const data = await getPeople(); 
          const uux = data.map((u) => ({
            id: u.id,
            name: u.name ?? "Undefined", // El ?? sirve para valores null/undefined
            email: u.email ?? "Undefined",
            phone: u.phone ?? "Undefined",
          }));
          setPersonas(uux);
          savePeople(uux); // guardamos la lista tras cargarla
        }
      }catch(error){
        console.error("Error cargando personas:", error);
      }finally{
        setIsLoading (false);
      }
    }
    loadInitial();
  }, []); // solo una vez al montar


  if(isLoading){
    return (
      <Container maxW="container.lg" p={4} textAlign="center">
        <Heading mb={4}>Mi App con Persistencia</Heading>
        <Text>Cargando datos, por favor espera...</Text>
      </Container>
    );
  }
  return (
    <Container maxW="container.lg" p={4}>
      <Heading mb={4}>Mi App con Persistencia</Heading>
      <Text>¡Hola, mundo!</Text>

      <VStack align="stretch" spacing={4}> 
        {/* Barra de búsqueda + crear */}
        <HStack>
          <Input
            placeholder="Buscar por nombre, email o teléfono…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleAdd}>
            + Añadir
          </Button>
        </HStack>
      </VStack>
      {/* Tabla responsive */}
      <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
        <Table.Root size="sm" variant="outline" striped interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Nombre</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Teléfono</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filtradas.map((p) => (
              <Table.Row key={p.id}>
                <Table.Cell>{p.id}</Table.Cell>
                <Table.Cell>{p.name}</Table.Cell>
                <Table.Cell>{p.email}</Table.Cell>
                <Table.Cell>{p.phone}</Table.Cell>
                <Table.Cell>{/* tus botones aquí */}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Container>
  );
}

export default App;

/*
Datos a recalcar:

Persistencia en cliente: guardar datos en el navegador (no en el servidor) usando localStorage.

Flujo de carga: “primero localStorage; si no hay, API; luego guardar local”.

useEffect con [] = ejecutar una vez al montar (carga inicial).

Sincronización: otro useEffect guarda la lista cuando cambia; otro guarda el filtro.

Filtro: no tocamos el estado original; derivamos filtradas con useMemo + filter.

Chakra UI: componentes listos (Container, HStack, VStack, Table, Buttons, Inputs, Spinner, toasts) → mejor UX sin pelear CSS.

*/
