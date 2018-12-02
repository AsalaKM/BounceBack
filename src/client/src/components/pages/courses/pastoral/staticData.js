export const state = {
  course_name: "",
  type: "",
  course_start: "",
  course_end: "",
  description: "",
  loading: true,
};
export const fields = [
  [
    {
      tag: "Input",
      label: "Name",
      name: "course_name",
      width: "20rem",
      placeholder: "course name",
    },
    {
      tag: "Input",
      label: "Type",
      name: "type",
      width: "20rem",
    }
  ],

  [
    {
      tag: "Input",
      label: "Start",
      name: "course_start",
      width: "20rem",
      type: "date"
    },
    {
      tag: "Input",
      label: "End",
      name: "course_end",
      width: "20rem",
      type: "date"
    }
  ],
  [
    {
      tag: "Textarea",
      label: "Description",
      name: "description",
      width: "45rem",
      height: "10rem"
    }
  ],
  [
    {
      tag: "Button",
      value: "Edit & Save",
      color: "#272727",
      staticField: true
    },
    {
      tag: "Button",
      value: "Back",
      color: "#FF4800",
      staticField: true
    }
  ]
];
export const validationForm = fields => {
  for (const key in fields) {
    if (fields[key] === "") return `Please Check ${key}`;
  }
};
