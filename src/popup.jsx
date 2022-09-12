import React, { useEffect, useState } from 'react'
import {
    Box, ChakraProvider, VStack, Flex, HStack, Image,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
    DrawerContent,
    Select,
    Stack,
    Avatar,
    AvatarBadge,
    Text, FormControl, Input, Heading, Button, FormLabel, Textarea, Icon, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Accordion,
    AccordionItem,
    useToast,
    AccordionButton,
    AccordionPanel,
    DrawerCloseButton,
    AccordionIcon,
    Tag,
    Link,
    Divider,
} from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import { BsTags } from 'react-icons/bs'
import { AiFillEdit } from 'react-icons/ai'
import { RiFoldersLine } from 'react-icons/ri'
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { ImCancelCircle } from 'react-icons/im'
import { TiTickOutline } from 'react-icons/ti'
import { AiFillDelete } from 'react-icons/ai'


function Popup() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: MOpen, onOpen: MOnOpen, onClose: MOnClose } = useDisclosure()
    const { isOpen: AOpen, onOpen: AOnOpen, onClose: AOnClose } = useDisclosure()
    const { isOpen: LisOpen, onOpen: LOnOpen, onClose: LOnClose } = useDisclosure()

    const btnRef = React.useRef()
    const btn2Ref = React.useRef()
    const btn3Ref = React.useRef()



    const [j, setJ] = useState('')
    const [Code, setCode] = useState('')
    const [AccessToken, setAccessToken] = useState('')

    const [currentTag, SetCurrentTag] = useState('')
    const [Tags, setTags] = useState([])

    const [currentAssigned, SetCurrentAssigned] = useState('')
    const [Assigned, SetAssigned] = useState([])


    const [AllTeams, SetTeams] = useState([])
    const toast = useToast()

    const [currentTeam, setCurrentTeam] = useState('')
    const [showTag, setShowTag] = useState(false)
    const [CurrentTeamAvatar, setCurrentTeamAvatar] = useState('')
    const [Spaces, SetSpaces] = useState([])
    const [Folders, SetFolders] = useState([])
    const [Lists, SetLists] = useState([])
    const [Tasks, SetTasks] = useState([])
    const [OneTask, SetOneTask] = useState({})

    const [currentSpace, setCurrentSpace] = useState('')
    const [currentFolder, setCurrentFolder] = useState('')
    const [currentList, setCurrentList] = useState('')
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')


    chrome.storage.sync.get('text', function (text) {
        setJ(text.text)
    })

    chrome.storage.sync.get('code', function (code) {
        setCode(code.code)

        if (Code.length < 0) {


            const GetMyAccessToken = async () => {

                const data = await fetch(`https://api.clickup.com/api/v2/oauth/token?client_id=BZZXK4XXFJY7N4W2DUHC51GJUXXTZJV6&client_secret=NNTF60UY0728Z2XPM0YXKJGCVQIHFP69A1TTV2UGJWYMNPU9B60C5MAFTFI8T3NL&code=${Code}`, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const jdata = await data.json()
                await chrome.storage.sync.set({ 'access_token': jdata.access_token })
            }
            GetMyAccessToken()
        }


    })


    chrome.storage.sync.get('team', function (team_id) {
        if (typeof (team_id) !== undefined) {
            setCurrentTeam(team_id.team)

            let av = AllTeams?.find(item => item.id === team_id.team)
            setCurrentTeamAvatar(av?.avatar)
        }
        else {
            setCurrentTeam("")
        }
    })





    chrome.storage.sync.get('access_token', function (access_token) {
        if (access_token) {
            setAccessToken(access_token.access_token)

        }
    })


    useEffect(() => {
        if (typeof (AccessToken) !== undefined) {
            const GetMyteams = async () => {

                const data = await fetch("https://api.clickup.com/api/v2/team", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": AccessToken
                    }
                })
                const jdata = await data.json()
                SetTeams(jdata.teams)

            }
            GetMyteams()
        }
    }, [AccessToken])




    const setCurrentTeamWithGoogle = (id) => {
        if (id) {
            chrome.storage.sync.set({ 'team': id })

            let av = AllTeams?.find(item => item.id === id)
            setCurrentTeamAvatar(av.avatar)
        }
    }





    useEffect(() => {
        const GetMySpaces = async () => {
            if (typeof (currentTeam) !== undefined) {
                const data = await fetch(`https://api.clickup.com/api/v2/team/${currentTeam}/space`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": AccessToken
                    }
                })
                const jdata = await data.json()
                SetSpaces(jdata.spaces)
            }

        }
        GetMySpaces()
    }, [currentTeam])







    useEffect(() => {
        if (currentSpace.length > 0) {
            const GetMyFolders = async () => {

                const data = await fetch(`https://api.clickup.com/api/v2/space/${currentSpace}/folder`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": AccessToken
                    }
                })
                const jdata = await data.json()
                SetFolders(jdata.folders)
            }
            GetMyFolders()
        }
    }, [currentSpace, currentSpace.length])

    const GetMyLists = async () => {
        if (currentFolder.length > 0) {
            SetLists(Folders[0]?.lists)
        }

    }


    const AddNewTag = () => {
        let clone = [...Tags]
        clone.push(currentTag)
        setTags(clone)
    }

    const AddNewAssignee = () => {
        let clone = [...Assigned]
        clone.push(currentAssigned)
        SetAssigned(clone)
    }

    const SendData = async (e) => {
        e.preventDefault()
        let obj = {
            name: title,
            description: description,
            assignees: Assigned,
            tags: Tags,
        }

        const data = await fetch(`https://api.clickup.com/api/v2/list/${currentList}/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": AccessToken
            },
            body: JSON.stringify(obj)
        })
        const jdata = await data.json()
        if (data.status == 200) {
            toast({
                size: 'xs',
                title: "Task created",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }
        else {
            toast({
                size: 'xs',
                title: "Enter all fields please",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }
        setCurrentList('')
        setTitle('')
        setDescription('')
        setTags([])
        SetAssigned([])


    }


    useEffect(() => {

        if (currentList.length > 0) {


            const GetMyTasks = async () => {
                const data = await fetch(`https://api.clickup.com/api/v2/list/${currentList}/task`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": AccessToken
                    }
                })
                const jdata = await data.json()

                SetTasks(jdata.tasks)

            }
            GetMyTasks()
        }


    }, [currentList.length])

    const GetATask = async (id) => {

        const data = await fetch(`https://api.clickup.com/api/v2/task/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": AccessToken
            }
        })
        const jdata = await data.json()
        SetOneTask(jdata)
    }

    const UpdateTask = async (updated, id) => {
        let obj = {

            name: updated.name,
            description: updated.description,
            tags: updated.tags
        }



        const data = await fetch(`https://api.clickup.com/api/v2/task/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": AccessToken,
            },
            body: JSON.stringify(obj)
        })
        const jdata = await data.json()
        if (data.status == 200) {
            toast({
                size: 'xs',
                title: "Task updated",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }
        else {
            toast({
                size: 'xs',
                title: "Something went wrong",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }

    }

    const DeleteTask = async (id) => {

        const data = await fetch(`https://api.clickup.com/api/v2/task/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": AccessToken
            }
        })



        if (!data) {
            toast({
                size: 'xs',
                title: "Something went wrong",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
          
        }
        else {
            toast({
                size: 'xs',
                title: "Task deleted",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }
        const newTasks = Tasks.filter((ele) => ele.id != id)
        SetTasks(newTasks)
        SetOneTask({})

    }


    return (AccessToken) ? (
        <Box w="400px" h="500px">

            <VStack w="100%" h="100%">
                <Box w="100%" h="10%">
                    <Flex w="100%" h="100%" alignItems={'center'} justifyContent={'flex-start'}>
                        <Box w="100%" h="100%" >
                            <HStack p={3} w="100%" h="100%" alignItems={'center'} justifyContent={'space-between'}>
                                <Image
                                    w="30%"
                                    src='./clickup.png' alt="clickup" />

                                <Stack direction='row' spacing={4} pr={3} py={2}>

                                    <Avatar
                                        ref={btn2Ref}
                                        src={CurrentTeamAvatar}
                                        cursor={'pointer'} size={'sm'}>
                                        <AvatarBadge
                                            boxSize='1.25em' bg='green.500' />
                                    </Avatar>
                                    <Popover>
                                        <PopoverTrigger>
                                            <IconButton
                                                color="white"
                                                bg="rgb(159, 122, 234)"
                                                size="sm" icon={<AiFillEdit />} />
                                        </PopoverTrigger>
                                        <PopoverContent w="max-content">
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverHeader>Select team</PopoverHeader>
                                            <PopoverBody>
                                                <VStack w="100%" spacing={3}>
                                                    {
                                                        AllTeams && AllTeams.length > 0 ? (
                                                            AllTeams?.map((item, i) => (
                                                                <Box spacing={3} key={i}>
                                                                    <Avatar
                                                                        key={i}
                                                                        src={item.avatar}
                                                                        cursor={'pointer'} size={'sm'}>
                                                                        <AvatarBadge boxSize='1.25em' bg='green.500' />
                                                                    </Avatar>
                                                                    <Button
                                                                        bg="white"
                                                                        size={'sm'}
                                                                        onClick={() => setCurrentTeamWithGoogle(item.id)}
                                                                        _hover={{ bg: 'purple.400', color: 'white' }}
                                                                    >
                                                                        {item.name}
                                                                    </Button>
                                                                </Box>
                                                            ))
                                                        ) : (<Box>
                                                            No teams
                                                        </Box>)

                                                    }

                                                </VStack>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>



                                    {/* You can also change the borderColor and bg of the badge */}

                                </Stack>
                            </HStack>

                        </Box>

                    </Flex>
                </Box>
                <Box w="100%" h="70%">
                    <VStack
                        alignItems={'flex-start'}
                        w="100%" h="100%">
                        <HStack alignItems={'flex-start'} justifyContent={'space-between'} w="100%" h="15%">
                            <Text
                                h="50%"
                                w="60%"
                                px={3}
                                py={3}
                                fontSize={'lg'} fontWeight={700} fontFamily={'monospace'}>
                                Manage tasks

                            </Text>

                            <Flex w="40%" h="100%" alignItems={'center'} justifyContent={'center'}>
                                <FormControl w="80%">
                                    <Input
                                        size={'sm'}
                                        placeholder='Search' />
                                </FormControl>
                            </Flex>

                        </HStack>

                        <VStack py={2} w="100%" h="75%" overflowY={'scroll'} overflowX={'hidden'}>


                            <Accordion
                                allowToggle={true}
                                w="100%">

                                {
                                    Spaces?.map((item, i) => (
                                        <AccordionItem

                                            onClick={() => { setCurrentSpace(item.id) }}
                                            w="100%" minH="15vh" key={i}>
                                            <h2>
                                                <AccordionButton>
                                                    <Box flex='1' textAlign='left'>
                                                        <VStack
                                                            alignItems={'flex-start'}
                                                            w="100%" h="100%">
                                                            <Heading size={'lg'} fontWeight={700} color={'purple.400'} fontFamily={'monospace'}>
                                                                {item.name}
                                                            </Heading>
                                                            <Text fontWeight={600} fontSize={'sm'}>
                                                                {item.id}
                                                            </Text>
                                                        </VStack>

                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                <Text fontWeight={700}>
                                                    <Icon as={RiFoldersLine} /> Folders:
                                                </Text>
                                                {
                                                    Folders && Folders.length > 0 ? (
                                                        Folders?.map((item, i) => (
                                                            <Box>

                                                                <VStack py={3} alignItems={'flex-start'} key={i} px={3}>

                                                                    <Link
                                                                        color={'purple.400'}
                                                                        fontWeight={700} fontSize={'lg'}>
                                                                        + {item.name}
                                                                    </Link>
                                                                    <Text fontWeight={700}>
                                                                        <Icon as={AiOutlineUnorderedList} /> Lists:
                                                                    </Text>
                                                                    {
                                                                        item.lists && item.lists.length > 0 ? (
                                                                            item.lists?.map((item2, i) => (
                                                                                <Box w="100%" key={i}>

                                                                                    <Link
                                                                                        ref={btn3Ref}
                                                                                        onClick={() => { setCurrentList(item2.id); LOnOpen() }}
                                                                                        color={'purple.400'}
                                                                                        px={3}
                                                                                        fontWeight={700} fontSize={'sm'}>
                                                                                        {"*"} {item2.name}
                                                                                    </Link>

                                                                                </Box>
                                                                            ))
                                                                        ) : (<Box>
                                                                            No lists
                                                                        </Box>)


                                                                    }

                                                                </VStack>

                                                            </Box>
                                                        ))
                                                    ) : (<Box>
                                                        No folders</Box>)
                                                }


                                            </AccordionPanel>
                                        </AccordionItem>
                                    ))

                                }
                                <Divider w="100%" />
                                <Drawer

                                    isOpen={LisOpen}
                                    placement='bottom'
                                    onClose={onClose}
                                    finalFocusRef={btn3Ref}
                                >
                                    <DrawerOverlay opacity={.8} />
                                    <DrawerContent h="500px">
                                        <DrawerCloseButton />
                                        <DrawerHeader color={'purple.400'}
                                            px={3}
                                            fontWeight={700} fontSize={'sm'}>Tasks</DrawerHeader>

                                        <DrawerBody>
                                            <VStack
                                                py={3}
                                                w="100%" maxH="100%" overflow={'scroll'}>
                                                <Accordion w="95%">


                                                    {
                                                        Tasks && Tasks.length > 0 ? (
                                                            Tasks?.map((item, i) => (
                                                                <AccordionItem

                                                                    w="100%"
                                                                    minH="15vh"
                                                                    cursor={'pointer'}
                                                                    borderRadius={3}
                                                                    transitionDelay={'100ms'}
                                                                    transitionDuration={'500ms'}
                                                                    _hover={{ boxShadow: 'lg', shadow: '1px 1px 5px 3px rgba(159, 122, 234, 0.6)' }}
                                                                    boxShadow={'lg'}
                                                                    key={i}>
                                                                    <h2>
                                                                        <HStack alignItems={'center'} w="100%" h="100%">
                                                                            <VStack
                                                                                px={4}
                                                                                py={2}
                                                                                alignItems={'flex-start'}
                                                                                w="80%" h="100%">


                                                                                <Heading
                                                                                    noOfLines={1}
                                                                                    size={'md'} fontWeight={700} fontFamily={'monospace'} color={'purple.400'}>
                                                                                    {item.name}
                                                                                </Heading>
                                                                                <HStack alignItems={'flex-start'}>
                                                                                    {
                                                                                        item.tags && item.tags.length > 0 ? (
                                                                                            <Text fontSize={'10px'} fontWeight={700}>
                                                                                                {item.tags.length} Tag
                                                                                            </Text>
                                                                                        ) : (<Box>No tags</Box>)
                                                                                    }
                                                                                </HStack>

                                                                            </VStack>
                                                                            <AccordionButton onClick={() => { GetATask(item?.id) }} w="20%">
                                                                                <AccordionIcon />
                                                                            </AccordionButton>
                                                                        </HStack>

                                                                    </h2>

                                                                    <AccordionPanel w="100%" h="max-content">
                                                                        {
                                                                            OneTask && OneTask.id !== '' ? (
                                                                                <Box>
                                                                                    <VStack alignItems={'flex-start'}>
                                                                                        <FormLabel>Title</FormLabel>
                                                                                        <Input
                                                                                            type="text"
                                                                                            value={OneTask.name}
                                                                                            onChange={(e) => {
                                                                                                SetOneTask(prevState => ({
                                                                                                    ...prevState,
                                                                                                    name: e.target.value
                                                                                                }))
                                                                                            }}
                                                                                        />
                                                                                        <FormLabel>Description</FormLabel>
                                                                                        <Textarea type="text"
                                                                                            value={OneTask.description}
                                                                                            onChange={(e) => {
                                                                                                SetOneTask(prevState => ({
                                                                                                    ...prevState,
                                                                                                    text_content: e.target.value,
                                                                                                    description: e.target.value
                                                                                                }))
                                                                                            }} />
                                                                                        <Text>
                                                                                            Tags
                                                                                        </Text>
                                                                                        <HStack flexWrap={'wrap'} h="max-content" w="100%" spacing={1}>
                                                                                            {
                                                                                                OneTask.tags && OneTask.tags.length > 0 ? (
                                                                                                    OneTask.tags?.map((tag, i) => (
                                                                                                        <HStack py={1} spacing={1}>
                                                                                                            <Tag
                                                                                                                size={'sm'}
                                                                                                                key={i} color={'white'} bg={tag.tag_fg}>
                                                                                                                {tag.name}
                                                                                                            </Tag>
                                                                                                            {/* <Icon
                                                                                                                onClick={() => {

                                                                                                                    const index = OneTask?.tags.map((a, i) => {
                                                                                                                        if (a.name === tag.name) {
                                                                                                                            return i
                                                                                                                        }
                                                                                                                    }).join("")


                                                                                                                    if (index > -1) {

                                                                                                                        let clone = OneTask.tags
                                                                                                                        clone.splice(index, 1)

                                                                                                                        SetOneTask((prevState) => ({
                                                                                                                            ...prevState,
                                                                                                                            tags: clone
                                                                                                                        }))
                                                                                                                    }
                                                                                                                }}
                                                                                                                _active={{ color: 'white' }} as={ImCancelCircle} size={'md'} /> */}
                                                                                                        </HStack>

                                                                                                    ))
                                                                                                ) : (<Box>
                                                                                                    Hello
                                                                                                </Box>)

                                                                                            }
                                                                                        </HStack>
                                                                                        <HStack>


                                                                                            {
                                                                                                OneTask.assignees && OneTask.assignees.length > 0 ? (
                                                                                                    OneTask.assignees?.map((ass, i) => (
                                                                                                        <HStack key={i} spacing={1}>
                                                                                                            <Tag
                                                                                                                size={'sm'}
                                                                                                                key={i} color={'white'}>
                                                                                                                {ass.name}
                                                                                                            </Tag>
                                                                                                            <Icon
                                                                                                                _active={{ color: 'white' }} as={ImCancelCircle} size={'md'} />
                                                                                                        </HStack>
                                                                                                    ))
                                                                                                ) : (<Box>
                                                                                                    No assignees</Box>)
                                                                                            }
                                                                                        </HStack>
                                                                                        <HStack justifyContent={'flex-end'} alignItems={'flex-end'} w="100%">
                                                                                            <IconButton size={'xs'} icon={<AiFillDelete />}
                                                                                                color={'white'}
                                                                                                bg="red.400"
                                                                                                onClick={() => { DeleteTask(OneTask?.id) }} />
                                                                                            <IconButton
                                                                                                size={'xs'}
                                                                                                color={'white'}
                                                                                                bg={'green.400'}
                                                                                                onClick={() => UpdateTask(OneTask, OneTask?.id)}
                                                                                                icon={<TiTickOutline />}
                                                                                            />

                                                                                        </HStack>
                                                                                    </VStack>
                                                                                </Box>
                                                                            ) : (<Box>
                                                                                Something went wrong</Box>)
                                                                        }
                                                                    </AccordionPanel>
                                                                </AccordionItem>
                                                            ))
                                                        ) : (<Box>No tasks</Box>)
                                                    }
                                                </Accordion>
                                            </VStack>
                                        </DrawerBody>

                                        <DrawerFooter>
                                            <Button variant='outline' mr={3} onClick={LOnClose}>
                                                Cancel
                                            </Button>
                                            <Button colorScheme='blue'>Save</Button>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            </Accordion>
                        </VStack>

                    </VStack>

                </Box>
                <Box w="100%" h="10%">
                    <Flex w="100%" h="100%" alignItems={'flex-start'} justifyContent={'center'}>
                        <Button
                            ref={btnRef}
                            boxShadow={'xl'}
                            color={'white'}
                            bg={"rgb(159, 122, 234)"}
                            onClick={() => { onOpen() }}
                        >
                            + Create a task
                        </Button>
                    </Flex>
                </Box>
                <Drawer
                    isOpen={isOpen}
                    placement='bottom'
                    onClose={onClose}
                    finalFocusRef={btnRef}
                >
                    <DrawerOverlay />
                    <DrawerContent
                        h="470px"
                    >

                        <DrawerHeader h="50px">
                            <HStack w="100%">
                                <Text color={'red.400'}
                                    w="20%"
                                    fontFamily={'monospace'}
                                    fontSize={'md'}
                                    fontWeight={600}>
                                    Cancel
                                </Text>
                                <Flex
                                    w="60%" alignItems={'center'} justifyContent={'center'}>
                                    <Text
                                        fontFamily={'monospace'}
                                        fontSize={'md'}
                                        fontWeight={600}>
                                        New task
                                    </Text>
                                </Flex>
                                <Button
                                    bg="white"
                                    color={'black'}
                                    _hover={{ bg: '' }}
                                    _disabled={true}
                                    w="20%"
                                    fontFamily={'monospace'}
                                    fontSize={'md'}
                                    fontWeight={600}>
                                    Done
                                </Button>

                            </HStack>
                        </DrawerHeader>

                        <DrawerBody>
                            <VStack w="100%" h="100%" spacing={2}>
                                <Box w="100%" h="13%">
                                    <Input
                                        w="100%" h="100%" placeholder='Title'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        variant={'flushed'}
                                        borderRadius={0}
                                        borderTop={'none'}
                                        borderLeft={'none'}
                                        borderRight={'none'}
                                    />
                                </Box>

                                <HStack
                                    py={'10px'}
                                    w="100%" h="25%" justifyContent={'space-between'}>

                                    <FormControl w="30%">
                                        <FormLabel fontSize={'15px'}>
                                            Space
                                        </FormLabel>
                                        <Select
                                            onChange={(e) => { setCurrentSpace(e.target.value) }}
                                            w="100%%" size={'sm'}>
                                            {
                                                Spaces ? (
                                                    Spaces?.map((item, i) => (
                                                        <option
                                                            value={item.id}
                                                            key={i}>
                                                            {item.name}
                                                        </option>
                                                    ))
                                                ) : (<option>
                                                    Err
                                                </option>)
                                            }
                                        </Select>
                                    </FormControl>


                                    <FormControl w="30%" fontSize={'15px'}>
                                        <FormLabel>
                                            Folder
                                        </FormLabel>
                                        <Select
                                            onClick={(e) => { setCurrentFolder(e.target.value); GetMyLists() }}
                                            isDisabled={Folders && Folders.length > 0 ? false : true}
                                            w="100%%" size={'sm'}>
                                            {
                                                Folders && Folders.length > 0 ? (
                                                    Folders?.map((item, i) => (
                                                        <option
                                                            value={item.id}
                                                            key={i}>
                                                            {item.name}
                                                        </option>
                                                    ))
                                                ) : (<option>
                                                    No folders
                                                </option>)
                                            }
                                        </Select>
                                    </FormControl>

                                    <FormControl w="30%" fontSize={'15px'}>
                                        <FormLabel>
                                            Lists
                                        </FormLabel>
                                        <Select
                                            onClick={(e) => { setCurrentList(e.target.value) }}
                                            isDisabled={Folders && Folders.length && currentFolder.length > 0 ? false : true}
                                            w="100%%" size={'sm'}>
                                            {
                                                Lists && Lists.length > 0 ? (
                                                    Lists?.map((item, i) => (
                                                        <option
                                                            value={item.id}
                                                            key={i}>
                                                            {item.name}
                                                        </option>
                                                    ))
                                                ) : (<option>
                                                    No lists
                                                </option>)
                                            }
                                        </Select>
                                    </FormControl>
                                </HStack>

                                <Box w="100%" h="45%">
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        h="100%"
                                        placeholder='Task description' />
                                </Box>

                                <HStack
                                    alignItems={'flex-start'}
                                    spacing={3}
                                    w="100%" h="5%" px={2}
                                    cursor={'pointer'}>
                                    {
                                        Tags.length > 0 ? (
                                            <HStack h="100%">
                                                <Text
                                                    cursor={'pointer'}
                                                    onClick={() => { setShowTag(!showTag); MOnOpen() }}
                                                >
                                                    {Tags.length == 1 ? (1 + " Tag") : ("+ " + (Tags.length - 1) + " Tags")}
                                                </Text>
                                            </HStack>) : (
                                            <HStack h="100%">
                                                <Icon
                                                    onClick={() => { setShowTag(!showTag); MOnOpen() }}
                                                    borderRadius={'5'}
                                                    as={BsTags} size={'sm'} />
                                                <Text
                                                    cursor={'pointer'}
                                                    onClick={() => { setShowTag(!showTag); MOnOpen() }}
                                                >
                                                    Add tags
                                                </Text>
                                            </HStack>
                                        )
                                    }


                                    {
                                        Assigned.length > 0 ? (
                                            <HStack h="100%">
                                                <Text
                                                    cursor={'pointer'}
                                                    onClick={() => { setShowTag(!showTag); MOnOpen() }}
                                                >
                                                    {Assigned.length == 1 ? (1 + " Assignee") : ("+ " + (Assigned.length - 1) + " Assignees")}
                                                </Text>
                                            </HStack>
                                        ) : (
                                            <HStack h="100%">
                                                <Icon
                                                    onClick={() => { setShowTag(!showTag); MOnOpen() }}
                                                    borderRadius={'5'}
                                                    as={BsTags} size={'sm'} />
                                                <Text
                                                    cursor={'pointer'}
                                                    onClick={() => { AOnOpen() }}
                                                >
                                                    Assign
                                                </Text>
                                            </HStack>
                                        )
                                    }

                                    <HStack>

                                    </HStack>

                                </HStack>




                            </VStack>


                        </DrawerBody>

                        <Modal isOpen={MOpen} onClose={MOnClose}>
                            <ModalOverlay />
                            <ModalContent w="300px">
                                <ModalHeader>Tag name</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Input
                                        value={currentTag}
                                        onChange={(e) => SetCurrentTag(e.target.value)}
                                        placeholder='One tag per line' />
                                </ModalBody>

                                <ModalFooter w="100%">
                                    <HStack w="100%" alignItems={'flex-start'} justifyContent={'space-between'}>
                                        <Button
                                            bg="white"
                                            color={'red.400'}
                                            _hover={{ bg: '' }}
                                            w="40%"
                                            onClick={() => { MOnClose() }}
                                            fontFamily={'monospace'}
                                            fontSize={'md'}
                                            fontWeight={600}>
                                            Cancel
                                        </Button>
                                        <Button
                                            bg="white"
                                            _hover={{ bg: '' }}
                                            w="40%"
                                            fontFamily={'monospace'}
                                            fontSize={'md'}
                                            onClick={(e) => {
                                                MOnClose();
                                                AddNewTag(); SetCurrentTag('')
                                            }}
                                            fontWeight={600}>
                                            Add
                                        </Button>
                                    </HStack>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>

                        <Modal isOpen={AOpen} onClose={AOnClose}>
                            <ModalOverlay />
                            <ModalContent w="300px">
                                <ModalHeader>Assign task</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Input
                                        value={currentAssigned}
                                        onChange={(e) => SetCurrentAssigned(e.target.value)}
                                        placeholder='Add user' />
                                </ModalBody>

                                <ModalFooter w="100%">
                                    <HStack w="100%" alignItems={'flex-start'} justifyContent={'space-between'}>
                                        <Button
                                            bg="white"
                                            color={'red.400'}
                                            _hover={{ bg: '' }}
                                            w="40%"
                                            onClick={() => { AOnClose(); }}
                                            fontFamily={'monospace'}
                                            fontSize={'md'}
                                            fontWeight={600}>
                                            Cancel
                                        </Button>
                                        <Button
                                            bg="white"
                                            _hover={{ bg: '' }}
                                            w="40%"
                                            onClick={(e) => {
                                                AOnClose();
                                                AddNewAssignee(); SetCurrentAssigned('')
                                            }}
                                            fontFamily={'monospace'}
                                            fontSize={'md'}
                                            fontWeight={600}>
                                            Add
                                        </Button>
                                    </HStack>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        <DrawerFooter>
                            <Button variant='outline' mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                onClick={(e) => SendData(e)}
                                colorScheme='blue'>Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

            </VStack>


        </Box>
    ) : (<Box>
        Login
    </Box>)


}




const root = ReactDOM.createRoot(document.getElementById("react-target"));

root.render(
    <ChakraProvider>
        <Popup />
    </ChakraProvider>
)


