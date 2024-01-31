import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const statusBarHeight = StatusBar.currentHeight;
const KEY_GPT = "********** SUA CHAVE AQUI **********"

export default function App() {

  const [city, setCity] = useState("");
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("");

  async function handleGenerate() {
    if (city === "") {
      Alert.alert("Atenção", "Preencha o nome da cidade!");
      return;
    }

    setTravel("");
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias na cidade de ${city}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        message: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        setTravel(data.choices[0].message.content)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <View style={styles.container}>

      <StatusBar barstyle="dark-content" translucent={true} backgroundColor='#F1F1F1' />

      <Text style={styles.heading}>Dicas de Viagem</Text>

      <View style={styles.form}>

        <Text style={styles.label}>Cidade destino</Text>
        <TextInput placeholder='Ex.: Praia Grande, SP' style={styles.input} value={city} onChangeText={(text) => setCity(text)} />

        <Text style={styles.label}>
          Tempo de estadia: <Text style={styles.days}>{days.toFixed(0)}</Text> dias
        </Text>

        <Slider
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#009698"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={(value) => setDays(value)}
        />

      </View>

      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Gerar roteiro de viagem</Text>
        <MaterialIcons name='travel-explore' size={24} color={'#fff'} />
      </Pressable>

      <ScrollView
        style={styles.containerScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}
      >

        {loading && (
          <View style={styles.content}>

            <Text style={styles.title}>Carregando roteiro...</Text>

            <ActivityIndicator color={'#000'} size={'large'} />

          </View>
        )}

        {travel && (
          <View style={styles.content}>

            <Text style={styles.title}>Roteiro da Viagem</Text>

            <Text>
              {travel}
            </Text>
          </View>
        )}

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    paddingTop: 20
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54
  },
  form: {
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  days: {
    backgroundColor: '#F1F1F1',
  },
  button: {
    backgroundColor: '#FF5656',
    width: '90%',
    borderRadius: 4,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },

});
