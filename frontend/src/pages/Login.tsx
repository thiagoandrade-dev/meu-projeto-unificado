import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { login, register } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: ""
  });

  const [registerCredentials, setRegisterCredentials] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(loginCredentials.email, loginCredentials.password);
      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo(a), ${data.usuario.nome}.`,
        duration: 3000,
      });

      setUser({
        id: data.usuario.id,
        nome: data.usuario.nome,
        email: data.usuario.email,
        tipo: data.usuario.perfil
      });

      if (data.usuario.perfil === "admin") {
        navigate("/admin");
      } else {
        navigate("/locatario");
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (registerCredentials.password !== registerCredentials.confirmPassword) {
      toast({
        title: "Erro no registro",
        description: "As senhas não conferem.",
        variant: "destructive",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      await register(
        registerCredentials.nome,
        registerCredentials.email,
        registerCredentials.password
      );

      toast({
        title: "Registro realizado!",
        description: "Sua conta foi criada com sucesso.",
        duration: 3000,
      });

      setIsLogin(true);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>{/* Seu JSX aqui */}</div>
  );
};

export default Login;
