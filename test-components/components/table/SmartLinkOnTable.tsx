type TableProps = {
  tableCellContentSmartLink?: boolean;
  tableCellSmartLink?: boolean;
  tableSmartLink?: boolean;
};

export const SmartLinkOnTable: React.FC<TableProps> = ({
  tableCellContentSmartLink,
  tableCellSmartLink,
  tableSmartLink,
}) => (
  <table
    className="table table-bordered"
    data-kontent-environment-id="p"
    data-kontent-language-codename="l"
    data-kontent-item-id="i"
    {...(tableSmartLink && { "data-kontent-element-codename": "e" })}
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
        <td {...(tableCellSmartLink && { "data-kontent-element-codename": "e" })}>
          <div {...(tableCellContentSmartLink && { "data-kontent-element-codename": "e" })}>1</div>
        </td>
        <td {...(tableCellSmartLink && { "data-kontent-element-codename": "e" })}>
          <div {...(tableCellContentSmartLink && { "data-kontent-element-codename": "e" })}>
            John Doe
          </div>
        </td>
        <td {...(tableCellSmartLink && { "data-kontent-element-codename": "e" })}>
          <div {...(tableCellContentSmartLink && { "data-kontent-element-codename": "e" })}>32</div>
        </td>
        <td {...(tableCellSmartLink && { "data-kontent-element-codename": "e" })}>
          <div {...(tableCellContentSmartLink && { "data-kontent-element-codename": "e" })}>
            Front End Developer
          </div>
        </td>
      </tr>
      <tr>
        <td {...(tableCellSmartLink && { "data-kontent-element-codename": "e" })}>
          <div {...(tableCellContentSmartLink && { "data-kontent-element-codename": "e" })}>2</div>
        </td>
        <td {...(tableCellSmartLink && { "data-kontent-element-codename": "e" })}>
          <div {...(tableCellContentSmartLink && { "data-kontent-element-codename": "e" })}>
            Jane Doe
          </div>
        </td>
        <td {...(tableCellSmartLink && { "data-kontent-element-codename": "e" })}>
          <div {...(tableCellContentSmartLink && { "data-kontent-element-codename": "e" })}>30</div>
        </td>
        <td {...(tableCellSmartLink && { "data-kontent-element-codename": "e" })}>
          <div {...(tableCellContentSmartLink && { "data-kontent-element-codename": "e" })}>
            Back End Developer
          </div>
        </td>
      </tr>
    </tbody>
  </table>
);
