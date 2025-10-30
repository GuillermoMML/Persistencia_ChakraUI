
import { ActionBar,Portal, Button, Kbd} from "@chakra-ui/react";

export default function MyActionBar({hasSelection,selection,onDelete}) {
  return (
    <ActionBar.Root open={hasSelection}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {selection.length} selected
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator />
            <Button variant="outline" size="sm" onClick={() => onDelete()}>
              Delete <Kbd>⌫</Kbd>
            </Button>
            <Button variant="outline" size="sm">
              Share <Kbd>T</Kbd>
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
