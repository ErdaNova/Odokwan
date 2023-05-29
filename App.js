import React from "react";
import { NavigationContainer } from "@react-navigation/native"
import Tabs from "./tabs";
import 'react-native-gesture-handler';
import { navigationRef } from "./RootNavigation";

import Realm from 'realm';
import { createRealmContext, RealmConfiguration, Builder } from '@realm/react';



export class Book extends Realm.Object {
    static schema = {
        name : "Book",
        properties:{
            _id:"int",
            title:"string",
            author:"string",
            image:"string",
            page:"int",
            readPage:"int",
            status :"int"
        },
        primaryKey:"_id"
    };

}

export class Odok extends Realm.Object {
    static schema = {
        name : "Odok",
        properties:{
            _id : "int",
            title:"string",
            author:"string",
            read_page:"int",
            read_time:"int",//초
            date:"string",
            time : "int",
            memo : "string"
        },
        primaryKey:"_id"
    };

}

const realmConfig = {
    schema: [Book, Odok],schemaVersion: 8,};

export const {RealmProvider, useRealm, useObject, useQuery} = createRealmContext(realmConfig);

const App = () => {
    return(
        <RealmProvider>
            <NavigationContainer ref = {navigationRef} >
                <Tabs />
            </NavigationContainer>
        </RealmProvider>
    );
}

export default App;