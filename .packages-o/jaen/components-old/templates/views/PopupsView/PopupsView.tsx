// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Switch,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import {LoadedPopupComponent} from 'packages/jaen/src/internal/helper/popup/loadPopupComponents.js'
import {useState} from 'react'
import {BiNotification, BiNotificationOff} from 'react-icons/bi'
// Assets

export interface PopupCardProps {
  isEnabled?: boolean
  title: string
  description: string
  imageURL: string
  onEdit: () => void
  onEnableToggle: () => void
}

export const PopupCard: React.FC<PopupCardProps> = ({
  isEnabled = false,
  title,
  description,
  imageURL,
  onEdit,
  onEnableToggle
}) => {
  const boxBg = 'white'
  const mainText = 'gray.800'
  const iconBox = 'gray.100'
  const iconColor = 'pink.500'
  return (
    <Flex
      shadow="base"
      rounded="lg"
      borderRadius="20px"
      bg={boxBg}
      p="20px"
      w={{base: '315px', md: '345px'}}
      alignItems="center"
      direction="column">
      <Flex w="100%" mb="18px" align="center" justifyContent="space-between">
        <Flex
          w="38px"
          h="38px"
          align="center"
          justify="center"
          borderRadius="50%"
          me="12px"
          bg={iconBox}>
          <Icon
            w="24px"
            h="24px"
            as={isEnabled ? BiNotification : BiNotificationOff}
            color={iconColor}
          />
        </Flex>

        <FormControl display="flex" alignItems="center" w="fit-content">
          <FormLabel htmlFor="enable-popup" mb="0">
            Active
          </FormLabel>
          <Switch
            id="enable-popup"
            onChange={onEnableToggle}
            isChecked={isEnabled}
          />
        </FormControl>
      </Flex>
      {imageURL ? (
        <Image src={imageURL} maxW="100%" borderRadius="20px" mb="10px" />
      ) : null}
      <Text
        fontWeight="600"
        color={mainText}
        textAlign="start"
        fontSize="xl"
        w="100%">
        {title}
      </Text>
      <Text
        fontWeight="400"
        color={mainText}
        textAlign="start"
        fontSize="sm"
        w="100%">
        {description}
      </Text>

      <Flex
        mt="auto"
        justify="space-between"
        w="100%"
        align="center"
        justifyContent="right">
        <Button size="sm" onClick={onEdit}>
          Edit
        </Button>
      </Flex>
    </Flex>
  )
}

export interface PopupsViewProps {
  isLoading: boolean
  popups: LoadedPopupComponent[]
  onPopupEnableToggle: (popup: LoadedPopupComponent) => void
}

export const PopupsView: React.FC<PopupsViewProps> = ({
  isLoading,
  popups,

  onPopupEnableToggle
}) => {
  const [popup, setPopup] = useState<LoadedPopupComponent | null>(null)

  const onPopupEdit = (popup: LoadedPopupComponent) => {
    setPopup(popup)
  }

  return (
    <>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Wrap spacing="8" overflow="visible">
          {popups.map(popup => (
            <WrapItem key={popup.id}>
              <PopupCard
                key={popup.id}
                title={popup.Component.options.label}
                description={popup.Component.options.description}
                imageURL={popup.Component.options.imageURL}
                onEdit={() => {
                  onPopupEdit(popup)
                }}
                onEnableToggle={() => {
                  onPopupEnableToggle(popup)
                }}
                isEnabled={popup.isActive}
              />
            </WrapItem>
          ))}
        </Wrap>
      )}

      {popup && (
        <popup.Component
          id={popup.id}
          popup={popup.popup}
          forceOpen
          onClose={() => {
            setPopup(null)
          }}
          edtiable
        />
      )}
    </>
  )
}