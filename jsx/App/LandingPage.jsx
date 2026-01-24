import React from 'react';
import { ENGLISH, ESPANOL } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const landingPageJSX = {
  [ENGLISH]:
    <div>
      <p>Welcome! This website is powered by <a href='https://github.com/BrownCLPS/LingView/' target="_blank" rel="noopener noreferrer">Lingview</a>. Click <a href='#/index'>"Index of Texts"</a> to see some example texts.</p>
      <p>To customize this welcome text, edit the jsx/App/LandingPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [ESPANOL]:
    <div>
      <p>¡Bienvenido! Este sitio web funciona con LingView. Haga clic <a href='#/index'>"Índice de textos"</a> para ver algunos textos de ejemplo. </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/LandingPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
};

export function LandingPage() {
  return <TranslatableText dictionary={landingPageJSX} />;
}
