interface ITableTemplateArgs {
  readonly tableCellContentSmartLink: boolean;
  readonly tableCellSmartLink: boolean;
  readonly tableSmartLink: boolean;
}

export const tableTemplateArgTypes = {
  tableCellContentSmartLink: {
    type: 'boolean',
  },
  tableCellSmartLink: {
    type: 'boolean',
  },
  tableSmartLink: {
    type: 'boolean',
  },
};

const TableTemplate = ({ tableCellContentSmartLink, tableCellSmartLink, tableSmartLink }: ITableTemplateArgs) => `
  <table
      class="table table-bordered"
      data-kontent-project-id="p"
      data-kontent-language-codename="l"
      data-kontent-item-id="i"
      ${tableSmartLink ? 'data-kontent-element-codename="e"' : ''}
  >
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Age</th>
        <th>Occupation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td ${tableCellSmartLink ? 'data-kontent-element-codename="e"' : ''}>
          <div ${tableCellContentSmartLink ? 'data-kontent-element-codename="e"' : ''}>1</div>
        </td>
        <td ${tableCellSmartLink ? 'data-kontent-element-codename="e"' : ''}>
          <div ${tableCellContentSmartLink ? 'data-kontent-element-codename="e"' : ''}>John Doe</div>
        </td>
        <td ${tableCellSmartLink ? 'data-kontent-element-codename="e"' : ''}>
          <div ${tableCellContentSmartLink ? 'data-kontent-element-codename="e"' : ''}>32</div>
        </td>
        <td ${tableCellSmartLink ? 'data-kontent-element-codename="e"' : ''}>
          <div ${tableCellContentSmartLink ? 'data-kontent-element-codename="e"' : ''}>Front End Developer</div>
        </td>
      </tr>
      <tr>
        <td ${tableCellSmartLink ? 'data-kontent-element-codename="e"' : ''}>
          <div ${tableCellContentSmartLink ? 'data-kontent-element-codename="e"' : ''}>2</div>
        </td>
        <td ${tableCellSmartLink ? 'data-kontent-element-codename="e"' : ''}>
          <div ${tableCellContentSmartLink ? 'data-kontent-element-codename="e"' : ''}>Jane Doe</div>
        </td>
        <td ${tableCellSmartLink ? 'data-kontent-element-codename="e"' : ''}>
          <div ${tableCellContentSmartLink ? 'data-kontent-element-codename="e"' : ''}>30</div>
        </td>
        <td ${tableCellSmartLink ? 'data-kontent-element-codename="e"' : ''}>
          <div ${tableCellContentSmartLink ? 'data-kontent-element-codename="e"' : ''}>Back End Developer</div>
        </td>
      </tr>
    </tbody>
  </table>
`;

export const SmartLinkOnTable = TableTemplate.bind({});
SmartLinkOnTable.storyName = 'Smart link on table';
SmartLinkOnTable.args = { tableSmartLink: true };

export const SmartLinkOnTableCell = TableTemplate.bind({});
SmartLinkOnTableCell.storyName = 'Smart link on table cell';
SmartLinkOnTableCell.args = { tableCellSmartLink: true };

export const SmartLinkInsideTableCell = TableTemplate.bind({});
SmartLinkInsideTableCell.storyName = 'Smart link inside table cell';
SmartLinkInsideTableCell.args = { tableCellContentSmartLink: true };

export const MultipleTableSmartLinks = TableTemplate.bind({});
MultipleTableSmartLinks.storyName = 'Multiple smart links inside table';
MultipleTableSmartLinks.args = { tableCellContentSmartLink: true, tableCellSmartLink: true, tableSmartLink: true };
