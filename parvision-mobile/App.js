import { StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { WebView } from 'react-native-webview'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{ uri: 'http://10.0.2.2:5173' }}
        style={styles.webview}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
})
