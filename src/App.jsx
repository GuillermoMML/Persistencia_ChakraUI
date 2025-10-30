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
  Portal,
  Checkbox,
  Kbd,
  ActionBar,
} from "@chakra-ui/react";

//https://chakra-ui.com/docs/components/table --> Action  Bar es la tabla que voy a utilizar
import { loadPeople, savePeople, loadQuery, saveQuery } from "./utils/storage";
import { useEffect, useMemo, useState } from "react";
import MyActionBar from "./components/ui/MyActionBar";

/*La persistencia en React usando localStorage implica guardar el estado de la aplicación en el almacenamiento local del navegador.
Esto permite que los datos persistan incluso después de que el usuario cierre o recargue la página web.

Esto nos sirvirá para guardar la lista de personas y el texto del filtro de búsqueda. Y casos reales podrían ser:
- Guardar las preferencias del usuario (tema, idioma).
- Mantener el estado de un carrito de compras.
- Recordar formularios parcialmente completados.

Aunque navegemos fuera de la app y vovamos, los datos  siguirán ahi porque están en el localStorage del navegador, que es como
una pequeña base de datos en el navegador, la unica forma de borrarlo es que el usuario lo haga manualmente o que el programa lo haga

*/
function App() {
  // 1) Estado inicial desde localStorage (sin efectos)
  const initialPeople = (() => {
    const local = loadPeople();

    //COmo load people puuede devolver null, en nuestro caso lo pasamos como array ya que con null no podemos trabajar
    return Array.isArray(local) ? local : [];
  })();

  //query -> estado del filtro de búsqueda, inicializado desde storage
  const [query, setQuery] = useState(loadQuery()); // filtro recordado
  const [personas, setPersonas] = useState(initialPeople);
  const [isLoading, setIsLoading] = useState(true);

  const [selection, setSelection] = useState([]);
  const hasSelection = selection.length > 0;

  // Acciones locales (no API) para practicar estado + persistencia
  function handleAdd() {
    const nueva = {
      id: Date.now(), // id temporal
      name: "Jose Ignacio",
      email: "JoseIgnacio@ejemplo.com",
      phone: "600 000 000",
    };

    const nueva2 = {
      id: Date.now() + 12,
      name: "Maria Lopez",
      email: "mariaLo@ejemplo.com",
      phone: "600 000 000",
    };
    setPersonas((prev) => [nueva2, ...prev]);
    // Un solo setPersonas; el useEffect([personas]) salvará en localStorage
    //setPersonas((prev) => [nueva, nueva2, ...prev]);
  }


  function onDelete(){
    console.log(selection)

    if(!window.confirm(`Estas seguro que quieres borrar ${selection.length} registros`)) return;
    //Eliminamos aquellas personas que no coincida con los id de nuestro selection
    setPersonas(prev => prev.filter(p => !selection.includes(p.id)))
    setSelection([])
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
    return personas.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
    );
  }, [personas, query]);

  {
    /*Para saber de donde saco los estilos de los componenetes de chakra ui
  https://chakra-ui.com/docs/components/table --> EN ESTE CASO ES LA TABLA PERO BUSCAS POR COMPONENTES DE TU ELECCIÓN 
  */
  }

  //Llegados a este punto ya tenemos que nuestra variable personas, guarda los datos de forma local pero no persistente,
  //para ello utilizamos useEffect para sincronizar el estado con localStorage

  // 3) useEffect para cargar la lista al montar

  //Para visualizar los datos guardados, nos vamos al DevTools -> Application -> Local Storage -> seleccionamos nuestra web
  useEffect(() => {
    savePeople(personas);
  }, [personas]);

  useEffect(() => {
    saveQuery(query);
  }, [query]);

  // Carga inicial: primero localStorage; si no hay, API

  useEffect(() => {
    async function loadInitial() {
      try {
        setIsLoading(true);

        const local = loadPeople(); //Esto puede devolver null por lo tanto comprobamos antes que sea un array para poder cargar los datos
        if (Array.isArray(local) && local.length > 0) {
          setPersonas(local);
        } else {
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
      } catch (error) {
        console.error("Error cargando personas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitial();
  }, []); // solo una vez al montar

  const rows = filtradas.map((item) => (
    <Table.Row
      key={item.id}
      data-selected={selection.includes(item.id) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(item.id)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.id]
                : selection.filter((id) => id !== item.id)
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{item.id}</Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.email}</Table.Cell>
      <Table.Cell>{item.phone}</Table.Cell>
    </Table.Row>
  ));

  const indeterminate = hasSelection && selection.length < filtradas.length;

  if (isLoading) {
    return (
      <Container maxW="container.lg" p={4} textAlign="center">
        <Heading mb={4}>Mi App con Persistencia</Heading>
        <Text>Cargando datos, por favor espera...</Text>
      </Container>
    );
  }
  return (
    <Container p={4}>
      <Heading mb={4}>Mi App con Persistencia</Heading>
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
        <Table.Root size="sm" striped interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="6">
                <Checkbox.Root
                  size="sm"
                  top="0.5"
                  aria-label="Select all rows"
                  checked={
                    indeterminate ? "indeterminate" : selection.length > 0
                  }
                  onCheckedChange={(changes) => {
                    setSelection(
                      changes.checked ? filtradas.map((item) => item.id) : []
                    );
                  }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.ColumnHeader>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader _hover={{ bg: "teal.400" }}>
                Nombre
              </Table.ColumnHeader>
              <Table.ColumnHeader _hover={{ bg: "teal.400" }}>
                Email
              </Table.ColumnHeader>
              <Table.ColumnHeader _hover={{ bg: "teal.400" }}>
                Teléfono
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>{rows}</Table.Body>
        </Table.Root>
      </Box>
      <MyActionBar hasSelection={hasSelection} selection={selection} onDelete={onDelete}/>
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
