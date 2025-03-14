export interface ChatRequest {
  input_value: string;
  output_type: string;
  input_type: string;
}

export interface ChatResponse {
  response: string;
}

const FLOW_ID = 'e4167236-938f-4aca-845b-21de3f399858';

export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`http://localhost:7860/api/v1/run/${FLOW_ID}?stream=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_value: message,
        output_type: 'chat',
        input_type: 'chat',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
} 