import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComplexForm, { ComplexFormProps } from '../components/ComplexForm/ComplexForm';

// it('test1', async () => {
//   const onSubmit = jest.fn();
//   const onCancel = jest.fn();
//   const result = render(<ComplexForm onSubmit={onSubmit} onCancel={onCancel} />);

//   expect(result.getByLabelText('First Name')).toBeInTheDocument();
//   expect(result.getByLabelText('Last Name')).toBeInTheDocument();

//   await act(async () => {
//     userEvent.click(result.getByLabelText('Are you at least 21 years old?'));
//   });

//   expect(result.getByLabelText(/Favorite Drink/i)).toBeInTheDocument();
// });

function renderComplexForm(props?: Partial<ComplexFormProps>) {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  const result = render(<ComplexForm onSubmit={onSubmit} onCancel={onCancel} {...props} />);

  const Heading = () => result.getByText(/Welcome,/i);

  const FirstNameInput = () => result.getByLabelText('First Name');

  const LastNameInput = () => result.getByLabelText('Last Name');

  const IsOver21Input = () => result.getByLabelText('Are you at least 21 years old?');

  const FavoriteDrinkInput = () => result.queryByLabelText("What's your favorite drink?");

  const CancelButton = () => result.getByText('Cancel');

  const SubmitButton = () => result.getByText('Apply');

  function changeFirstName(name: string) {
    userEvent.type(FirstNameInput(), name);
  }

  function changeLastName(name: string) {
    userEvent.type(LastNameInput(), name);
  }

  function changeFavoriteDrinkInput(name: string) {
    userEvent.type(FavoriteDrinkInput() as HTMLElement, name);
  }

  async function clickIsOver21() {
    await act(async () => {
      userEvent.click(IsOver21Input());
    });
  }

  function clickSubmit() {
    userEvent.click(SubmitButton());
  }

  function clickCancel() {
    userEvent.click(CancelButton());
  }

  return {
    result,
    onSubmit,
    changeFirstName,
    changeLastName,
    clickIsOver21,
    clickSubmit,
    clickCancel,
    FirstNameInput,
    LastNameInput,
    IsOver21Input,
    SubmitButton,
    CancelButton,
    Heading,
    FavoriteDrinkInput,
    changeFavoriteDrinkInput,
    onCancel,
  };
}

describe('<ComplexForm/>', () => {
  it('기본 필드 렌더링', async () => {
    const { FirstNameInput, LastNameInput, IsOver21Input, SubmitButton, Heading, CancelButton } = renderComplexForm();

    const fields = [FirstNameInput(), LastNameInput(), IsOver21Input(), SubmitButton(), Heading(), CancelButton()];

    fields.forEach((field) => expect(field).toBeInTheDocument());
  });

  it('21세 이상입니다. 체크 후 favorite drink 필드 입력', async () => {
    const { clickIsOver21, FavoriteDrinkInput } = renderComplexForm();

    expect(FavoriteDrinkInput()).not.toBeInTheDocument();

    await clickIsOver21();

    expect(FavoriteDrinkInput()).toBeInTheDocument();
  });

  it('취소버튼 클릭', async () => {
    const { clickCancel, onCancel } = renderComplexForm();

    clickCancel();

    expect(onCancel).toHaveBeenCalled();
  });

  it('onSubmit data 확인', async () => {
    const { changeFirstName, changeLastName, clickIsOver21, changeFavoriteDrinkInput, clickSubmit, onSubmit, result } =
      renderComplexForm();

    const name = '태현';

    changeFirstName(name);
    changeLastName('박');

    await clickIsOver21();
    changeFavoriteDrinkInput('소주');
    clickSubmit();

    expect(onSubmit).toHaveBeenCalledWith({
      first_name: name,
      last_name: '박',
      is_over_21: true,
      favorite_drink: '소주',
    });

    expect(result.getByText(`Welcome, ${name}`)).toBeInTheDocument();
  });
});
