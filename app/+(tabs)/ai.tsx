import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GEMINI_API_KEY = "AIzaSyAeTDa5nERvkvkiNXWw1Jkq9sSU3pX-woo";

type Message = {
    role: 'user' | 'model';
    text: string;
};

export default function AIScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [base64, setBase64] = useState<string | any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const clearAll = () => {
        setImage(null);
        setBase64(null);
        setMessages([]);
        setInputText('');
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        const result = source === 'camera'
            ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.8 })
            : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.8 });

        if (result.canceled || !result.assets[0].base64) return;

        const uri = result.assets[0].uri;
        const imageBase64 = result.assets[0].base64!;

        setImage(uri);
        setBase64(imageBase64);
        setMessages([]);
        setLoading(true);

        await sendMessage("Describe this image in 5 short bullet points with confidence %.", imageBase64, true);
        setLoading(false);
    };

    const sendMessage = async (text: string, imageBase64?: string, isFirst = false) => {
        if (!text.trim() && !imageBase64) return;

        const userMsg: Message = { role: 'user', text: text || "[Image]" };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            const parts: any[] = imageBase64
                ? [
                    { text },
                    { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                ]
                : [{ text }];

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                         
                            ...(imageBase64 && isFirst ? [{
                                role: "user",
                                parts: [
                                    { text: "Describe this image in detail." },
                                    { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                                ]
                            }] : []),
                           
                            ...messages.map(m => ({
                                role: m.role,
                                parts: [{ text: m.text }]
                            })),
                           
                            { role: "user", parts }
                        ]
                    })
                }
            );

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || "API error");
            }

            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

            setMessages(prev => [...prev, { role: 'model', text: reply }]);
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (err: any) {
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>AI Vision Chat</Text>
            <Text style={styles.subtitle}>Upload once → Ask anything about the image</Text>

            {!image ? (
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.btn} onPress={() => pickImage('camera')}>
                        <Text style={styles.btnText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => pickImage('gallery')}>
                        <Text style={styles.btnText}>Gallery</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.preview} resizeMode="contain" />
                    <TouchableOpacity style={styles.closeBtn} onPress={clearAll}>
                        <Ionicons name="close-circle" size={40} color="#ff3b30" />
                    </TouchableOpacity>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(_, i) => i.toString()}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                            <Text style={item.role === 'user' ? styles.userText : styles.aiText}>
                                {item.text}
                            </Text>
                        </View>
                    )}
                    ListHeaderComponent={() => loading && <ActivityIndicator color="#00ff9d" style={{ margin: 20 }} />}
                />

                {image && (
                    <View style={styles.inputBar}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ask anything about the image..."
                            placeholderTextColor="#666"
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={() => sendMessage(inputText, base64)}
                            editable={!loading}
                        />
                        <TouchableOpacity
                            onPress={() => sendMessage(inputText, base64)}
                            disabled={!inputText.trim() || loading}
                        >
                            <Ionicons name="send" size={28} color={inputText.trim() ? "#00ff9d" : "#444"} />
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    header: { fontSize: 32, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
    subtitle: { fontSize: 16, color: '#00ff9d', textAlign: 'center', marginVertical: 10 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', margin: 40 },
    btn: { backgroundColor: '#00ff9d', padding: 18, borderRadius: 16, flex: 0.45, alignItems: 'center' },
    btnText: { fontSize: 18, color: '#000', fontWeight: 'bold' },
    imageWrapper: { position: 'relative', padding: 20 },
    preview: { width: '100%', height: 350, borderRadius: 20 },
    closeBtn: { position: 'absolute', top: 30, right: 30 },
    bubble: { padding: 14, borderRadius: 18, marginVertical: 6, maxWidth: '80%' },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#00ff9d' },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: '#1a1a1a' },
    userText: { color: '#000', fontSize: 16 },
    aiText: { color: '#fff', fontSize: 16 },
    inputBar: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#111',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#222'
    },
    textInput: {
        flex: 1,
        backgroundColor: '#1f1f1f',
        color: '#fff',
        padding: 14,
        borderRadius: 25,
        marginRight: 10,
        fontSize: 16
    },
});