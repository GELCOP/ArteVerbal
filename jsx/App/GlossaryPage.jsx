import React from 'react';
import { ENGLISH, ESPANOL } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const glossaryPageJSX = {
  [ENGLISH] :
    <div>
      <p>Input glossary here :) </p>
      <p>To customize this welcome text, edit the jsx/App/GlossaryPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [ESPANOL] :
    <div>
      <p>Ingrese el glosario aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/GlossaryPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
};

export function GlossaryPage() {
  return <TranslatableText dictionary={glossaryPageJSX} />;
}
