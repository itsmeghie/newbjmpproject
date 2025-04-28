import { BASE_URL } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation} from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";

type AddUserForm = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

const AddUser = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [selectUser, setSelectUser] = useState<AddUserForm>({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    });

    const UserMutation = useMutation({
        mutationKey: ['user'],
        mutationFn: async (user: AddUserForm) => {
            const res = await fetch(`${BASE_URL}/api/user/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(user),
            });
            if (!res.ok) {
                let errorMessage = "Error Adding User";
                try {
                    const errorData = await res.json();
                    errorMessage =
                        errorData?.message ||
                        errorData?.error ||
                        JSON.stringify(errorData);
                } catch {
                    errorMessage = "Unexpected error occurred";
                }
                throw new Error(errorMessage);
            }
            return res.json();
        },
        onSuccess: () => {
            messageApi.success("Added successfully");
            onClose();
        },
        onError: (error) => {
            messageApi.error(error.message);
        },
    });

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        UserMutation.mutate(selectUser);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setSelectUser(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleUserSubmit}>
                <div className="grid grid-cols-1 w-full gap-3">
                    <div>
                        <p>Email:</p>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="h-12 border w-full border-gray-300 rounded-lg px-2"
                        />
                    </div>
                    <div>
                        <p>Password:</p>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            onChange={handleInputChange}
                            placeholder="Password"
                            className="h-12 border w-full border-gray-300 rounded-lg px-2"
                        />
                    </div>
                    <div>
                        <p>First Name:</p>
                        <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            onChange={handleInputChange}
                            placeholder="First Name"
                            className="h-12 border w-full border-gray-300 rounded-lg px-2"
                        />
                    </div>
                    <div>
                        <p>Last Name:</p>
                        <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            className="h-12 border w-full border-gray-300 rounded-lg px-2"
                        />
                    </div>
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;