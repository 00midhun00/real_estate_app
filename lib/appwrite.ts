import { Avatars, Client , Account, OAuthProvider } from 'react-native-appwrite';

import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';

export const config = {
    platform: 'com.mdn.realestate',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectid: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
}

export const client = new Client();

client 
    .setEndpoint(config.endpoint !)
    .setProject(config.projectid !)
    .setPlatform(config.platform !)


export const avatar = new Avatars(client);
export const account = new Account(client);


export async function login() {
    try {
        const redirectUri = Linking.createURL('/');
        const response = await account.createOAuth2Token(
            OAuthProvider.Google, redirectUri
        );

        if(!response) { throw new Error('Failed to login') }

        const browserResult = await openAuthSessionAsync (
            response.toString(), 
            redirectUri
        );

        if (browserResult.type != 'success') { throw new Error('Failed to login') }

        const url = new URL(browserResult.url);
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if (!secret || !userId) { throw new Error('Failed to login') }


        const session = await account.createSession(userId,secret);

        if (!session) { throw new Error('Failed to login') }

        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}

export async function logout() {
    try {
        await account.deleteSession('current');

        }catch(e){
            console.error(e);
            return false;
        }
}

export async function getCurrentUser() {

        try {
            const response = await account.get();

            if(response.$id) {
                const userAvatar = avatar.getInitials(response.name);

                return {
                ...response,
                avatar: userAvatar.toString(),
            }
            }
            
            } catch(e){
                return null;
            }
}