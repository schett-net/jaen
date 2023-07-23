import {As, Box, HStack, Icon, Input, Stack, Text} from '@chakra-ui/react'
import {useMemo, useState} from 'react'

import {MenuButton} from '../../../../shared/MenuButton/MenuButton'

export interface ChooseButtonProps {
  items: Record<
    string,
    {
      label: string
      Icon?: As
    }
  >
  placeholder?: ChooseButtonProps['items'][0]
  onChange?: (selectedKey: string) => void
}

export const ChooseButton: React.FC<ChooseButtonProps> = ({
  items,
  placeholder = {
    label: 'Choose'
  },
  onChange
}) => {
  const [chosen, setChosen] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const menuButtonItems = useMemo(() => {
    const filteredItems = Object.entries(items)
      .filter(([key, value]) => {
        const lowercaseKey = key.toLowerCase()
        const lowercaseLabel = value.label.toLowerCase()
        const lowercaseSearchQuery = searchQuery.toLowerCase()
        return (
          lowercaseKey.includes(lowercaseSearchQuery) ||
          lowercaseLabel.includes(lowercaseSearchQuery)
        )
      })
      .reduce<any>((acc, [key, value], index) => {
        acc[index] = {
          label: value.label,
          onClick: () => {
            setChosen(key)
            if (onChange) {
              onChange(key)
            }
          }
        }
        return acc
      }, [])

    return filteredItems
  }, [items, searchQuery])

  const selectedLabel =
    chosen !== null ? items[chosen]?.label : placeholder.label
  const selectedIcon = chosen !== null ? items[chosen]?.Icon : placeholder.Icon

  return (
    <Box pos="relative">
      <MenuButton
        bgColor="bg.subtle"
        items={menuButtonItems}
        renderItems={items => {
          return (
            <Stack>
              <Input
                w="unset"
                size="sm"
                mx="2"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                }}
              />
              {items}
            </Stack>
          )
        }}>
        <HStack>
          {selectedIcon && <Icon as={selectedIcon} />}
          <Text>{selectedLabel}</Text>
        </HStack>
      </MenuButton>
    </Box>
  )
}