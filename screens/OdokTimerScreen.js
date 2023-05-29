import React, { useState, useRef, useEffect, } from 'react';
import { 
    Button, 
    View, 
    StyleSheet, 
    Pressable, 
    Text, 
    Animated, 
    TextInput,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Image
} from 'react-native';
import { Icon } from "@rneui/themed";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';
import { Book, useObject, useRealm } from '../App';




const OdokTimerScreen = ({navigation, route}) => {
    const insets = useSafeAreaInsets();
    const date = new Date();
    const [count, setCount] = useState(0);
    const realm = useRealm();
    
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [isActive, setIsActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const increment = useRef(null);

    const [page, setPage] = useState('');
    const [memo, setMemo] = useState('');

    const startTimer = () => {
        setEndTime('');
        setIsActive(!isActive);
        {
            !isActive ?
            (increment.current = setInterval(() => {
                setCount((count) => count + 1)
            }, 1000))
            :
            (clearInterval(increment.current))
        }
        {
            startTime.length === 0 ? 
            setStartTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`)
            :
            null
        }
        
    }

    const stopTimer = () => {
        clearInterval(increment.current);
        setIsActive(false);
        // setCount(0);
        // navigation.navigate('OdokCreate');
        setModalVisible(true);
        {
            endTime.length === 0 ? 
            setEndTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`)
            :
            null
        }
        console.log(`${date.getHours()}:${date.getMinutes()}`);
    }

    const formatTime = () => {
        const getSeconds = `0${(count % 60)}`.slice(-2)
        const minutes = `${Math.floor(count / 60)}`
        const getMinutes = `0${minutes % 60}`.slice(-2)
        const getHours = `0${Math.floor(count / 3600)}`.slice(-2)

        return `${getHours} : ${getMinutes} : ${getSeconds}`
    }

    const totalFormatTime = () => {
        const getSeconds = `0${(count % 60)}`.slice(-2)
        const minutes = `${Math.floor(count / 60)}`
        const getMinutes = `0${minutes % 60}`.slice(-2)
        const getHours = `0${Math.floor(count / 3600)}`.slice(-2)

        return `${getHours}h ${getMinutes}m ${getSeconds}s`
    }

    const currentId = () =>{
        if(realm.objects("Odok").max("_id")){
            return(Number(realm.objects("Odok").max("_id")+1))
        }else{
            return(1)
        }
    }

    const currenBook = useObject(Book, route.params.id)
    

    const saveOdok = () => {



        realm.write(() => {
            realm.create("Odok", {
                _id : currentId(),
                title: route.params.title,
                author:route.params.author,
                read_page:Number(page) - route.params.readPage,
                read_time:count,//초
                date:`${date.getFullYear()}-${convert(date.getMonth())}-${convert(date.getDate())}`,
                time : date.getHours(),
                memo : memo
            })
        }

        
        
        )

        
        realm.write(() => {
            currenBook.readPage = Number(page)
        })
        navigation.navigate("HomeScreen")

    }

    const convert = (item) => {
        if(Number(item) < 10){
            return(`0${item}`)
        }else{
            return(item)
        }
    }

    return(
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View
                style={{
                    height: 250,
                    width: 200,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 30,
                }}
            >
                <Image 
                        source={{ uri : route.params.image}}
                        style={{width:"100%", height:"100%"}}
                    />
                {/* <Text style={{ fontSize: 20, color: "black" }}>
                    Book Cover
                </Text> */}

            </View>
            <Text style={{ fontSize: 20, color: "black" }}>
                {route.params.title}
            </Text>
            <Text style={{ fontSize: 30, color: "black" }}>
                {formatTime()}
            </Text>
            <View 
                style={{
                    flexDirection: "row",

                }}
            >
                <Pressable 
                    onPress={startTimer}
                    style={{
                        marginHorizontal: 10,
                    }}
                >
                    <Icon 
                        name={!isActive ? 'play-circle' : 'pause-circle'}
                        type='ionicon'
                        size={60}
                    />
                </Pressable>
                <Pressable 
                    onPress={stopTimer}
                    style={{
                        marginHorizontal: 10,
                    }}
                >
                    <Icon 
                        name='stop-circle'
                        type='ionicon'
                        size={60}
                    />
                </Pressable>
            </View>
            {/* <Button
                title="exit to home"
                onPress={() => navigation.navigate("HomeScreen")}
            /> */}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <Pressable 
                    style={[
                        StyleSheet.absoluteFill,
                        { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    ]}
                    onPress={()=>
                        {
                            setModalVisible(false);
                        }
                    }
                />
                <View
                    style={{
                    padding: 16,
                    width: '100%',
                    // maxWidth: 400,
                    borderRadius: 10,
                    position: "absolute",
                    bottom: 0,
                    height: "70%",
                    backgroundColor: "white",
                    }}
                >

                    <View
                        style={{
                            justifyContent: "space-between",
                            flexDirection: "row",
                        }}
                    >
                        <Text style={{ fontSize: 20, color: "black" }}>
                            End Odok
                        </Text>
                        <Pressable
                            onPress={() => setModalVisible(false)}
                        >
                            <Icon 
                                name='close'
                                type='antdesign'
                                size={30}
                            />
                        </Pressable>
                    </View>
                    <Pressable 
                        style={{ marginTop: 20, }}
                        onPress={() => Keyboard.dismiss()}    
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                                Title
                            </Text>
                            <Text>
                            {route.params.title}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                                Time
                            </Text>
                            <Text>
                                {`${startTime} ~ ${endTime}`}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                                Total
                            </Text>
                            <Text>
                                {totalFormatTime()}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                                // backgroundColor:"pink"
                            }}
                        >
                            <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                                Pages
                            </Text>
                            <Text>
                                {route.params.readPage}p ~ 
                            </Text>
                            <TextInput 
                                placeholder='type page'
                                style={{
                                    borderWidth: 1,
                                    // height: "100%",
                                    padding: 0,
                                    paddingHorizontal: 10,
                                }}
                                keyboardType='number-pad'
                                onChangeText={(text) => setPage(text)}
                            />
                            <Text>
                                {` p`} 
                            </Text>
                        </View>
                        <View
                            style={{
                                // flexDirection: "row",
                                // alignItems: "center",
                                marginTop: 10,
                            }}
                        >
                            <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                                Memo
                            </Text>
                            <ScrollView
                                scrollEnabled={false}
                            >
                            <TextInput 
                                placeholder='type text'
                                style={{
                                    borderWidth: 1,
                                    padding: 0,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    height: 180,
                                }}
                                multiline={true}
                                textAlignVertical="top"
                                onChangeText={(text) => setMemo(text)}
                            />
                            </ScrollView>
                        </View>

                    </Pressable>
                    <View
                        style={{
                            // flexDirection: "row",
                            alignItems:  "flex-end",
                            justifyContent: "center",
                            marginTop: 10,
                            
                        }}
                    >
                        <Pressable
                            style={{
                                borderWidth: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                // backgroundColor: 'pink'
                                // width: "20%",
                                paddingHorizontal: 25,
                                paddingVertical: 5,
                            }}
                            onPress={saveOdok}
                        >
                            <Text style={{ fontSize: 15, color: "black" }}>
                                Save
                            </Text>
                        </Pressable>

                    </View>

                </View>


            </Modal>
        </KeyboardAvoidingView>
    );
}

const OdokCreateScreen = ({navigation, route}) => {
    const { colors } = useTheme();
    const { current } = useCardAnimation();

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Pressable
                style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                ]}
                onPress={navigation.goBack}
            />
            <Animated.View
                style={{
                padding: 16,
                width: '100%',
                // maxWidth: 400,
                borderRadius: 10,
                backgroundColor: colors.card,
                position: "absolute",
                bottom: 0,
                height: "70%",
                transform: [
                    {
                    scale: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                        extrapolate: 'clamp',
                    }),
                    },
                ],
                }}
            >

                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                    }}
                >
                    <Text style={{ fontSize: 20, color: "black" }}>
                        End Odok
                    </Text>
                    <Pressable
                        onPress={navigation.goBack}
                    >
                        <Icon 
                            name='close'
                            type='antdesign'
                            size={30}
                        />
                    </Pressable>
                </View>
                <Pressable 
                    style={{ marginTop: 20, }}
                    onPress={() => Keyboard.dismiss()}    
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                            Title
                        </Text>
                        <Text>
                            Book Title
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                            Time
                        </Text>
                        <Text>
                            14:23 ~ 15:27
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                            Total
                        </Text>
                        <Text>
                            1h 5m 23s
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10,
                            // backgroundColor:"pink"
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                            Pages
                        </Text>
                        <Text>
                            {`113p ~ `} 
                        </Text>
                        <TextInput 
                            placeholder='type page'
                            style={{
                                borderWidth: 1,
                                // height: "100%",
                                padding: 0,
                                paddingHorizontal: 10,
                            }}
                            keyboardType='number-pad'
                        />
                        <Text>
                            {` p`} 
                        </Text>
                    </View>
                    <View
                        style={{
                            // flexDirection: "row",
                            // alignItems: "center",
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "black", width: 70, }}>
                            Memo
                        </Text>
                        <ScrollView
                            scrollEnabled={false}
                        >
                        <TextInput 
                            placeholder='type text'
                            style={{
                                borderWidth: 1,
                                padding: 0,
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                height: 180,
                            }}
                            multiline={true}
                            textAlignVertical="top"
                        />
                        </ScrollView>
                    </View>

                </Pressable>
                <View
                    style={{
                        // flexDirection: "row",
                        alignItems:  "flex-end",
                        justifyContent: "center",
                        marginTop: 10,
                        
                    }}
                >
                    <Pressable
                        style={{
                            borderWidth: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            // backgroundColor: 'pink'
                            // width: "20%",
                            paddingHorizontal: 25,
                            paddingVertical: 5,
                        }}
                        onPress={() => navigation.navigate("HomeScreen")}
                    >
                        <Text style={{ fontSize: 15, color: "black" }}>
                            Save
                        </Text>
                    </Pressable>

                </View>

            </Animated.View>
        </KeyboardAvoidingView>
    )
}

export {OdokTimerScreen, OdokCreateScreen};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#fff',
    },
    notesInput: {
        height: 100,
        width: 200,
        backgroundColor: '#fff',
        marginBottom: 20,
        padding: 10,
    },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
      },
})