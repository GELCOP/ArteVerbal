import React from 'react';
import { TranslatableText } from './locale/TranslatableText.jsx';
import { 
  indexPageTitleHeaderText, 
  indexPageMediaHeaderText 
} from './locale/LocaleConstants.jsx';

require('datatables.net-dt');
import 'datatables.net-dt/css/jquery.dataTables.css';

export class StoryIndex extends React.Component {
  async componentDidMount() {
    const index = (await import('~./data/index.json')).default;
    let storyList = [];

    for (const story in index) {
      if (index.hasOwnProperty(story)) {
        // Title + Subtitle
        let mainTitle = index[story]['title']['con-Latn-EC'];
        if (index[story]['title']['_default'] !== '') {
          mainTitle = index[story]['title']['_default'];
        }
        const subtitle = index[story]['subtitle'] || '';
        let titleWithSubtitle = mainTitle;
        if (subtitle !== '') {
          titleWithSubtitle += `<br/><span class="indexSubtitle">${subtitle}</span>`;
        }

        // React Router link, wrapping title + subtitle
        const link = `<a href='#/story/${index[story]['story ID']}'>${titleWithSubtitle}</a>`;

        const narration = index[story]['narration'] || '';
        const translation = index[story]['translation'] || '';
        const language = index[story]['author'] || '';
        storyList.push([link, language, narration, translation]);
      }
    }

    $(document).ready(function () {
      $('#indexTable').DataTable({
        data: storyList,
        columns: [{}, {}, {}, {}], 
        scrollY: '75vh',
        scrollCollapse: true,
        paging: false,
        columnDefs: [
          { className: "dt-center", targets: "_all" } // 👈 centrado global
        ]
      });
    });

    $('#indexTable').addClass("stripe");
  }

  render() {
    return (
      <div id="index">
        <table id="indexTable">
          <thead>
            <tr>
              <th>Título</th>
              <th>Lengua</th>
              <th>Narración</th>
              <th>Traducción</th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}
