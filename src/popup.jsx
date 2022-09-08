import React, { useEffect, useState } from 'react'
import { Box, ChakraProvider, VStack, Flex, HStack, Image, Icon, Text, Divider, FormControl, Input, Heading, Button } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'



function Popup() {
    const [j, setJ] = useState('')
    const [Code, setCode] = useState('')
    const [AccessToken, setAccessToken] = useState('')

    const [createTask,setCreateTask] = useState(false)

    console.log(createTask)

    chrome.storage.sync.get('text', function (text) {
        setJ(text.text)
    })

    chrome.storage.sync.get('code', function (code) {
        setCode(code.code)
    })



    useEffect(() => {
        if (typeof(Code) == undefined) {
            const GetMyAccessToken = async () => {
                
                const data = await fetch(`https://api.clickup.com/api/v2/oauth/token?client_id=BZZXK4XXFJY7N4W2DUHC51GJUXXTZJV6&client_secret=NNTF60UY0728Z2XPM0YXKJGCVQIHFP69A1TTV2UGJWYMNPU9B60C5MAFTFI8T3NL&code=${Code}`, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const jdata = await data.json()
                chrome.storage.sync.set({ 'access_token': jdata.access_token })
            }
            GetMyAccessToken()
        }
        

    }, [Code])

    chrome.storage.sync.get('access_token', function (access_token) {
        if(access_token){
            setAccessToken(access_token.access_token)
        }
    })

    

    const RecentDocs = [
        {
            document_name: "I like movies",
            located_in: "Everything",
            tags: "3",
            last_updated: "04-09-2022"
        },
        {
            document_name: "Coimbatore",
            located_in: "Everything",
            tags: "2",
            last_updated: "04-09-2022"
        },
        {
            document_name: "C++ problems",
            located_in: "Everything",
            tags: "1",
            last_updated: "04-09-2022"
        },
        {
            document_name: "C++ problems",
            located_in: "Everything",
            tags: "1",
            last_updated: "04-09-2022"
        }
    ]
    

    return (
        <Box w="400px" h="500px">
            {
                createTask ? (
                    <VStack w="100%" h="100%">
                <Box w="100%" h="10%">
                    <Flex w="100%" h="100%" alignItems={'center'} justifyContent={'flex-start'}>
                        <Box w="50%" h="100%" >
                            <HStack p={3} w="100%" h="100%">
                                <Image
                                    w="70%"
                                    src='./clickup.png' alt="clickup" />
                            </HStack>

                        </Box>

                    </Flex>
                </Box>
                

            </VStack>
                ):(
                    <VStack w="100%" h="100%">
                <Box w="100%" h="10%">
                    <Flex w="100%" h="100%" alignItems={'center'} justifyContent={'flex-start'}>
                        <Box w="50%" h="100%" >
                            <HStack p={3} w="100%" h="100%">
                                <Image
                                    w="70%"
                                    src='./clickup.png' alt="clickup" />
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
                                Recent Tasks

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
                            {
                                RecentDocs?.map((item, i) => (
                                    <Box w="90%" minH="15vh" key={i}>

                                        <HStack
                                            cursor={'pointer'}
                                            borderRadius={3}
                                            transitionDelay={'100ms'}
                                            transitionDuration={'500ms'}
                                            _hover={{ boxShadow: 'lg', shadow: '1px 1px 5px 3px rgba(159, 122, 234, 0.6)' }}
                                            boxShadow={'lg'}
                                            w="100%" h="100%">
                                            <Box w="50%" h="100%">
                                                <VStack p={3} spacing={0} w="100%" h="100%" alignItems={'flex-start'} justifyContent={"flex-start"}>
                                                    <Heading fontSize={'2xl'}
                                                        fontWeight={700}
                                                        color={'rgb(159, 122, 234)'}
                                                        fontFamily={'monospace'}
                                                    >
                                                        Task name
                                                    </Heading>
                                                    <Text fontWeight={700} fontFamily={'monospace'}>
                                                        Task description
                                                    </Text>
                                                </VStack>
                                            </Box>
                                        </HStack>
                                    </Box>
                                ))
                            }
                        </VStack>
                    </VStack>

                </Box>
                <Box w="100%" h="10%">
                    <Flex w="100%" h="100%" alignItems={'flex-start'} justifyContent={'center'}>
                        <Button
                            boxShadow={'xl'}
                            color={'white'}
                            bg={"rgb(159, 122, 234)"}
                            onClick={()=>{setCreateTask(!createTask)}}
                        >
                            + Create a task
                        </Button>
                    </Flex>
                </Box>

            </VStack>
                )
            }
            
        </Box>
    )
}




const root = ReactDOM.createRoot(document.getElementById("react-target"));

root.render(
    <ChakraProvider>
        <Popup />
    </ChakraProvider>
)


