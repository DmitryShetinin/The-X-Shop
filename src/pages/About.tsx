import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FaShippingFast, FaShieldAlt, FaHandshake, FaGlobeAsia, FaBoxOpen } from "react-icons/fa";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Анимации для плавного появления
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const stats = [
    { value: "5+", label: "Лет на рынке" },
    { value: "10K+", label: "Довольных клиентов" },
    { value: "500+", label: "Товаров в ассортименте" },
    { value: "95%", label: "Положительных отзывов" }
  ];

  const advantages = [
    {
      icon: <FaShippingFast className="text-3xl" />,
      title: "Быстрая доставка",
      description: "Отправка товаров в течение 24 часов после заказа"
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Гарантия качества",
      description: "Все товары проходят тщательную проверку перед отправкой"
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: "Прямые поставки",
      description: "Работаем напрямую с производителями без посредников"
    },
    {
      icon: <FaGlobeAsia className="text-3xl" />,
      title: "По всей России",
      description: "Доставляем в любой регион удобным для вас способом"
    },
    {
      icon: <FaBoxOpen className="text-3xl" />,
      title: "Широкий ассортимент",
      description: "Более 500 позиций электроники и товаров для дома"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Герой-секция */}
      <div className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-600 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              О компании <span className="text-blue-300">The X Shop</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Мы - мост между качественными китайскими товарами и российскими покупателями
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[150px]"
                >
                  <div className="text-3xl font-bold text-blue-300">{stat.value}</div>
                  <div className="text-sm mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-16">
        {/* Секция с преимуществами */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <div className="text-center mb-16">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
            >
              Почему выбирают нас
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="w-24 h-1 bg-blue-600 mx-auto mb-8"
            ></motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="text-blue-600 mb-4">{advantage.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Секция "О компании" */}
        <motion.section 
          className="mb-20 flex flex-col lg:flex-row items-center gap-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 lg:h-[500px]" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-lg z-[-1]"></div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Наша история</h2>
            <div className="space-y-5 text-gray-700">
              <p className="text-lg leading-relaxed">
                Компания <span className="font-semibold text-blue-600">The X Shop</span> уже более 5 лет занимается поставкой и реализацией товаров из Китая. 
                Начав с небольшой команды энтузиастов, сегодня мы стали надежным партнером для тысяч покупателей по всей России.
              </p>
              <p className="leading-relaxed">
                Мы напрямую сотрудничаем с производителями, что позволяет предлагать нашим клиентам 
                качественные товары по доступным ценам без лишних наценок.
              </p>
              <p className="leading-relaxed">
                За годы работы мы зарекомендовали себя как надёжный партнёр, поставляющий 
                широкий ассортимент электроники и товаров для дома.
              </p>
              <p className="leading-relaxed">
                Наша миссия - сделать качественные китайские товары доступными для каждого россиянина, 
                обеспечивая при этом высокий уровень сервиса и поддержки.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Секция с призывом к действию */}
        <motion.section 
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-center mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Готовы сделать заказ или у вас есть вопросы?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Мы всегда готовы помочь вам с выбором товара, оформлением заказа или ответить на любые вопросы
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/catalog" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-full transition duration-300 shadow-lg"
            >
              Перейти в каталог
            </Link>
            <Link 
              to="/contacts" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-full transition duration-300"
            >
              Связаться с нами
            </Link>
          </div>
        </motion.section>

        {/* Дополнительная информация */}
        <motion.div 
          className="prose prose-lg max-w-none mx-auto bg-white p-8 rounded-xl shadow-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Наши принципы работы</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
              <span><strong>Качество превыше всего</strong> - каждый товар проходит многоэтапную проверку</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
              <span><strong>Прозрачность</strong> - никаких скрытых платежей и условий</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
              <span><strong>Поддержка 24/7</strong> - наша служба поддержки всегда на связи</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
              <span><strong>Гибкие условия</strong> - различные способы оплаты и доставки</span>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p>
              Если у вас остались вопросы, вы можете ознакомиться с разделом{" "}
              <Link to="/delivery" className="text-blue-600 hover:underline font-medium">
                Доставка
              </Link>{" "}
              или посетить страницу{" "}
              <Link to="/contacts" className="text-blue-600 hover:underline font-medium">
                Контакты
              </Link>
              , чтобы связаться с нами напрямую.
            </p>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;