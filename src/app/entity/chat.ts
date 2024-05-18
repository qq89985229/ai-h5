export interface IDelta{
  role: string;
  content: string;
}
export interface IChoice{
  author: string;
  avatar: string;
  delta: IDelta;
  finishReason?: string;
}
export interface IChat {
  id: string;
  choices: IChoice [];
  createdAt: string;
}

export interface IUserChoiceBody{
  token: string;
  chatId: string;
  content: string
}
