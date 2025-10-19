<template>
  <div class="app">
    <h1>AI Translator</h1>

    <div class="form">
      <textarea
        v-model="inputText"
        placeholder="Enter text to translate"
        rows="5"
      ></textarea>

      <select v-model="targetLang">
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
        <option value="zh-Hans">Chinese</option>
        <option value="ar">Arabic</option>
      </select>

      <button @click="handleTranslate" :disabled="loading">
        {{ loading ? 'Translating...' : 'Translate' }}
      </button>
    </div>

    <div v-if="translatedText" class="output">
      <h3>Translated Text:</h3>
      <p>{{ translatedText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const inputText = ref('');
const targetLang = ref('fr');
const translatedText = ref('');
const loading = ref(false);

const SOURCE_LANG = 'en';

function normalize(code) {
  if (code === 'zh-Hans') return 'zh-CN';
  return code;
}

async function translateViaMyMemory(text, fromCode, toCode) {
  const langpair = `${fromCode}|${toCode}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${encodeURIComponent(langpair)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data?.responseData?.translatedText || 'No translation found.';
}

const handleTranslate = async () => {
  translatedText.value = '';
  if (!inputText.value.trim()) return;

  loading.value = true;
  try {
    const to = normalize(targetLang.value);
    translatedText.value = await translateViaMyMemory(inputText.value, SOURCE_LANG, to);
  } catch (e) {
    console.error(e);
    alert(e.message || 'Unable to translate text.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
  .app {
    max-width: 700px;
    margin: 50px auto;
    text-align: center;
    font-family: 'Inter', sans-serif;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  textarea {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: none;
  }

  select, button {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 6px;
    border: none;
  }

  button {
    background-color: #0078D7;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    background-color: #ccc;
  }
  
  .output {
    margin-top: 30px;
    background-color: #4a4a4a;
    padding: 20px;
    border-radius: 8px;
  }
</style>
